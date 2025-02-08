"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion } from "framer-motion"

type FileUploadProps = {
  onChange: (files: File[]) => void
}

export function FileUpload({ onChange }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles)
      onChange(acceptedFiles)
    },
    [onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-500">Drop the files here ...</p>
      ) : (
        <p>Drag n drop some files here, or click to select files</p>
      )}
      {files.length > 0 && (
        <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-left">
          {files.map((file) => (
            <li key={file.name} className="text-sm text-gray-600">
              {file.name} - {(file.size / 1024).toFixed(2)} KB
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}

