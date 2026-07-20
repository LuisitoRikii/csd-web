import { useState, useMemo, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Folder, FolderOpen, File as FileIcon, Download, Trash2, Upload,
  ChevronRight, ChevronDown, ArrowUp, HardDrive, Search,
  FileText, Image as ImageIcon, FileVideo, FileArchive, FileCode,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { filesService } from '@/services'
import { AdminShell } from '@/components/admin/AdminShell'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const ACCEPTED = '*'

function pickIcon(mime, name) {
  const ext = (name?.split('.').pop() || '').toLowerCase()
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) return ImageIcon
  if (['mp4', 'mov', 'webm', 'avi'].includes(ext)) return FileVideo
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return FileArchive
  if (['js', 'jsx', 'ts', 'tsx', 'py', 'json', 'html', 'css'].includes(ext)) return FileCode
  if (mime?.startsWith('image/')) return ImageIcon
  if (mime?.startsWith('video/')) return FileVideo
  return FileText
}

const TreeNode = ({ node, depth = 0, onNavigate, onDelete, t }) => {
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(depth < 2)
  const isDir = node.type === 'directory'

  return (
    <div>
      <div
        className={`group flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-subtle transition-colors ${
          depth === 0 ? '' : ''
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {isDir ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t('files_collapse', 'Collapse') : t('files_expand', 'Expand')}
            aria-expanded={open}
            className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
          >
            {!reduced && (
              <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronRight size={14} aria-hidden="true" />
              </motion.span>
            )}
            {reduced && (open ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
          </button>
        ) : (
          <span className="shrink-0 w-6 h-6 flex items-center justify-center text-steel">
            {(() => {
              const Icon = pickIcon(node.mime, node.name)
              return <Icon size={14} aria-hidden="true" />
            })()}
          </span>
        )}

        {isDir ? (
          <button
            type="button"
            onClick={() => onNavigate?.(node.path)}
            className="flex items-center gap-2 flex-1 min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet rounded"
          >
            {open ? <FolderOpen size={15} className="text-violet shrink-0" aria-hidden="true" /> : <Folder size={15} className="text-violet shrink-0" aria-hidden="true" />}
            <span className="text-sm font-medium truncate text-ink">{node.name}</span>
          </button>
        ) : (
          <a
            href={filesService.downloadUrl(node.path)}
            download
            className="flex items-center gap-2 flex-1 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet rounded"
          >
            <span className="text-sm truncate text-ink">{node.name}</span>
          </a>
        )}

        <span className="hidden sm:inline text-xs text-steel tabular-nums shrink-0 w-20 text-right">
          {node.size_human}
        </span>

        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          {isDir ? (
            <a
              href={filesService.zipUrl(node.path)}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
              aria-label={t('files_download_folder') + ' ' + node.name}
              title={t('files_download_folder')}
            >
              <Download size={13} aria-hidden="true" />
            </a>
          ) : (
            <a
              href={filesService.downloadUrl(node.path)}
              download
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
              aria-label={t('files_download_file') + ' ' + node.name}
              title={t('files_download_file')}
            >
              <Download size={13} aria-hidden="true" />
            </a>
          )}
          <button
            type="button"
            onClick={() => onDelete?.(node)}
            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
            aria-label={t('files_delete') + ' ' + node.name}
            title={t('files_delete')}
          >
            <Trash2 size={13} aria-hidden="true" />
          </button>
        </div>
      </div>

      {isDir && open && node.children?.length > 0 && (
        <div role="group">
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              onNavigate={onNavigate}
              onDelete={onDelete}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const AdminFilesPage = () => {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [confirm, setConfirm] = useState(null)
  const [path, setPath] = useState('')
  const [search, setSearch] = useState('')
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const { data: tree, isLoading } = useQuery({
    queryKey: ['admin-files-tree', path],
    queryFn: () => filesService.tree(path, 4),
  })

  const { data: usage } = useQuery({
    queryKey: ['admin-files-usage'],
    queryFn: () => filesService.diskUsage(),
    staleTime: 60_000,
  })

  const uploadM = useMutation({
    mutationFn: ({ file, target }) => filesService.upload(file, target),
    onSuccess: (res) => {
      qc.invalidateQueries(['admin-files-tree'])
      qc.invalidateQueries(['admin-files-usage'])
      toast.success(`Uploaded ${res.name}`)
    },
    onError: () => toast.error(t('common.error')),
  })

  const removeM = useMutation({
    mutationFn: (target) => filesService.remove(target),
    onSuccess: () => {
      qc.invalidateQueries(['admin-files-tree'])
      qc.invalidateQueries(['admin-files-usage'])
      toast.success('Deleted')
      setConfirm(null)
    },
    onError: () => toast.error(t('common.error')),
  })

  const navigate = useCallback((p) => setPath(p), [])
  const goUp = useCallback(() => {
    if (!path) return
    const parts = path.split('/').filter(Boolean)
    parts.pop()
    setPath(parts.join('/'))
  }, [path])

  const handleFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList || [])
      if (!files.length) return
      files.forEach((f) => uploadM.mutate({ file: f, target: path }))
    },
    [path, uploadM]
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer?.files)
    },
    [handleFiles]
  )

  const filteredChildren = useMemo(() => {
    if (!tree?.children) return []
    if (!search.trim()) return tree.children
    const q = search.toLowerCase()
    const walk = (nodes) =>
      nodes.flatMap((n) => {
        if (n.name.toLowerCase().includes(q)) return [n]
        if (n.type === 'directory') return walk(n.children || [])
        return []
      })
    return walk(tree.children)
  }, [tree, search])

  const crumbs = useMemo(() => {
    const parts = path.split('/').filter(Boolean)
    return [
      { name: t('files_root_crumbs'), path: '' },
      ...parts.map((p, i) => ({
        name: p,
        path: parts.slice(0, i + 1).join('/'),
      })),
    ]
  }, [path, t])

  return (
    <AdminShell
      subtitle={t('admin.subtitle_studio')}
      title={t('files_title')}
      actions={
        <div className="flex items-center gap-2">
          <a
            href={filesService.zipUrl(path)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink/15 text-sm hover:bg-subtle transition-colors"
          >
            <Download size={14} /> {t('files_download_folder')}
          </a>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadM.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-paper text-sm disabled:opacity-50"
          >
            <Upload size={14} /> {uploadM.isPending ? t('files_uploading') : t('files_upload')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            accept={ACCEPTED}
            onChange={(e) => {
              handleFiles(e.target.files)
              e.target.value = ''
            }}
          />
        </div>
      }
    >
      <div className="p-6 lg:p-12 space-y-6">
        {/* Disk usage card */}
        {usage && (
          <div className="rounded-3xl bg-paper border border-line p-5 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet/10 text-violet flex items-center justify-center">
                <HardDrive size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-steel font-semibold">
                  {t('files_disk_usage')}
                </p>
                <p className="font-serif text-2xl tracking-tight">{usage.total_human}</p>
              </div>
            </div>
            <div className="text-xs text-steel">
              {usage.file_count} {t('files').toLowerCase().includes('files') ? 'files' : 'archivos'} ·{' '}
              {usage.folder_count} {t('files').toLowerCase().includes('files') ? 'folders' : 'carpetas'}
            </div>
            {usage.by_folder && Object.keys(usage.by_folder).length > 0 && (
              <div className="flex flex-wrap gap-2 ml-auto">
                {Object.entries(usage.by_folder).slice(0, 6).map(([folder, size]) => (
                  <span
                    key={folder}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-subtle text-xs text-charcoal"
                  >
                    <Folder size={11} aria-hidden="true" />
                    <span className="font-mono">{folder || '/'}</span>
                    <span className="text-steel tabular-nums">{size}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm flex-wrap">
          {crumbs.map((c, i) => (
            <span key={c.path} className="inline-flex items-center gap-2">
              {i > 0 && <ChevronRight size={12} className="text-steel" aria-hidden="true" />}
              <button
                type="button"
                onClick={() => setPath(c.path)}
                className={`hover:text-violet transition-colors ${
                  i === crumbs.length - 1 ? 'text-ink font-medium' : 'text-steel'
                }`}
              >
                {c.name || '/'}
              </button>
            </span>
          ))}
          {path && (
            <button
              type="button"
              onClick={goUp}
              className="ml-3 inline-flex items-center gap-1 text-xs text-steel hover:text-ink"
              aria-label={t('files_back')}
            >
              <ArrowUp size={11} aria-hidden="true" /> ..
            </button>
          )}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 rounded-2xl bg-paper border border-line px-4 py-2.5">
          <Search size={14} className="text-steel shrink-0" aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search in ${path || t('files_root_crumbs')}…`}
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        {/* Tree / file list */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`relative rounded-3xl bg-paper border ${
            isDragging ? 'border-violet ring-2 ring-violet/30' : 'border-line'
          } transition-all min-h-[400px]`}
        >
          {isDragging && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-violet/10 backdrop-blur-sm rounded-3xl pointer-events-none">
              <div className="text-center">
                <Upload size={36} className="text-violet mx-auto mb-2" aria-hidden="true" />
                <p className="font-medium text-violet">{t('files_drag_drop')}</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="p-12 text-center text-steel text-sm">…</div>
          ) : !tree || filteredChildren.length === 0 ? (
            <div className="p-16 text-center text-steel">
              <Folder size={32} className="mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm">{t('files_empty_folder')}</p>
              <p className="text-xs text-steel/70 mt-1">{t('files_drag_drop')}</p>
            </div>
          ) : (
            <div className="p-3">
              {search.trim()
                ? filteredChildren.map((child) => (
                    <TreeNode
                      key={child.path}
                      node={child}
                      onNavigate={navigate}
                      onDelete={(n) => setConfirm(n)}
                      t={t}
                    />
                  ))
                : filteredChildren.map((child) => (
                    <TreeNode
                      key={child.path}
                      node={child}
                      onNavigate={navigate}
                      onDelete={(n) => setConfirm(n)}
                      t={t}
                    />
                  ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm && removeM.mutate(confirm.path)}
        title={t('files_delete_confirm').replace('{name}', confirm?.name || '')}
      />
    </AdminShell>
  )
}
