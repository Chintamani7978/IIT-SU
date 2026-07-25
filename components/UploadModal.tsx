'use client';

import { useEffect, useState, useTransition } from 'react';
import { UploadCloud, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { addResource } from '@/lib/mockDb';
import { Resource } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { submitResource } from '@/lib/actions';

const MAX_PDF_BYTES = 20 * 1024 * 1024;

export default function UploadModal({ subjectId, live = false }: { subjectId: string; live?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title: '',
    authorName: '',
    batch: '',
    type: 'note',
    unit: '',
    link: '',
    examType: 'mid-sem',
    year: new Date().getFullYear().toString(),
  });

  useEffect(() => {
    if (!live || !isOpen) return;
    createClient()
      .auth.getUser()
      .then(({ data }) => setUser(data.user));
  }, [live, isOpen]);

  const needsFile = formData.type !== 'video';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (needsFile) {
      if (!file) {
        setError('Please choose a PDF file.');
        return;
      }
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are accepted.');
        return;
      }
      if (file.size > MAX_PDF_BYTES) {
        setError('PDF must be 20 MB or smaller.');
        return;
      }
    }

    startTransition(async () => {
      let filePath: string | undefined;

      if (needsFile && file) {
        const folder = user ? user.id : 'anonymous';
        filePath = `${folder}/${crypto.randomUUID()}.pdf`;
        if (live) {
          const supabase = createClient();
          const { error: uploadError } = await supabase.storage
            .from('resources')
            .upload(filePath, file, { contentType: 'application/pdf' });
          if (uploadError) {
            setError(`Upload failed: ${uploadError.message}`);
            return;
          }
        }
      }

      const result = await submitResource({
        subjectId,
        type: formData.type as 'note' | 'pyq' | 'video' | 'lab',
        title: formData.title,
        authorName: formData.authorName,
        batch: formData.batch || undefined,
        unit: formData.unit || undefined,
        filePath: live ? filePath : formData.link,
        videoUrl: formData.type === 'video' ? formData.link : undefined,
        examType: formData.examType as 'mid-sem' | 'end-sem',
        examYear: formData.year,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
      }
    });
  };

  const close = () => {
    setIsOpen(false);
    setSubmitted(false);
    setError(null);
    setFile(null);
  };

  const inputClass =
    'w-full bg-[var(--background)] border border-[var(--border)] rounded-md p-2 text-[var(--foreground)] focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--neon-hover)] text-[var(--primary-foreground)] px-4 py-2 rounded-md font-bold transition-colors shadow-lg shadow-[var(--primary)]/20"
      >
        <UploadCloud className="w-5 h-5" />
        Upload Resource
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={close} />

          <div className="relative w-full max-w-lg bg-[var(--card)] border border-[var(--border)] shadow-2xl rounded-xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Upload Resource</h2>
              <button onClick={close} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                <X className="w-6 h-6" />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Submitted for review</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  A moderator will review your upload before it appears publicly.
                </p>
                <button
                  onClick={close}
                  className="mt-2 px-6 py-2 bg-[var(--primary)] hover:bg-[var(--neon-hover)] text-[var(--primary-foreground)] font-bold rounded-md transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Resource Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={inputClass}
                  >
                    <option value="note">Class Notes</option>
                    <option value="pyq">PYQs & Solutions</option>
                    <option value="video">Video Lecture</option>
                    <option value="lab">Lab Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={inputClass}
                    placeholder="e.g., Unit 1 Complete Notes"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Author Name</label>
                    <input
                      required
                      type="text"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      className={inputClass}
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Batch</label>
                    <input
                      type="text"
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                      className={inputClass}
                      placeholder="e.g., 2024"
                    />
                  </div>
                </div>

                {(formData.type === 'note' || formData.type === 'video' || formData.type === 'lab') && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Unit / Topic</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className={inputClass}
                      placeholder="e.g., Unit 3"
                    />
                  </div>
                )}

                {formData.type === 'pyq' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Exam Type</label>
                      <select
                        value={formData.examType}
                        onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                        className={inputClass}
                      >
                        <option value="mid-sem">Mid-Sem</option>
                        <option value="end-sem">End-Sem</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Year</label>
                      <input
                        required
                        type="text"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className={inputClass}
                        placeholder="e.g., 2023"
                      />
                    </div>
                  </div>
                )}

                {needsFile && live ? (
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      PDF File (max 20 MB)
                    </label>
                    <input
                      required
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className={`${inputClass} file:mr-3 file:px-3 file:py-1 file:rounded file:border-0 file:bg-[var(--primary)] file:text-[var(--primary-foreground)] file:font-medium`}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      {formData.type === 'video' ? 'Video URL' : 'Link (PDF/Video URL)'}
                    </label>
                    <input
                      required
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className={inputClass}
                      placeholder="https://..."
                    />
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md p-3">
                    {error}
                  </p>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-[var(--primary)] hover:bg-[var(--neon-hover)] text-[var(--primary-foreground)] font-bold py-2 rounded-md transition-colors disabled:opacity-60"
                  >
                    {isPending ? 'Uploading…' : 'Submit for Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
