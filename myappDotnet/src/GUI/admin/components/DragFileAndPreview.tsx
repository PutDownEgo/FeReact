import React, { useEffect, useRef, useState } from 'react';
import '../css/DragAndDropPreviewImage.css';

export type ImageType = { name: string; url: string };

type DragFileAndPreviewProps = {
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    initialImages?: ImageType[];
};

function DragFileAndPreview({ selectedFile, setSelectedFile, initialImages }: DragFileAndPreviewProps) {
    const [images, setImages] = useState<ImageType[]>(initialImages || []);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialImages) {
            setImages(initialImages);
        }
    }, [initialImages]);

    useEffect(() => {
        if (selectedFile) {
            const newImage = { name: selectedFile.name, url: URL.createObjectURL(selectedFile) };
            setImages([newImage]);
        }
    }, [selectedFile]);

    function selectFiles() {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    function onFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (files && files[0]) {
            setSelectedFile(files[0]);
        }
    }

    function onDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragging(true);
        event.dataTransfer.dropEffect = 'copy';
    }

    function onDragLeave(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragging(false);
    }

    function onDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragging(false);
        const files = event.dataTransfer.files;
        if (files && files[0]) {
            setSelectedFile(files[0]);
        }
    }


    function handleOnDelete(index: number) {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    }

    return (
        <div className="preview-image-card">
            <div className="preview-image-drag-area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                {isDragging ? (
                    <span className='preview-image-select'>
                        Drop images here
                    </span>
                ) : (
                    <>Drag & drop image here or
                        <span className='preview-image-select' role='button' onClick={selectFiles}>
                            Browse
                        </span>
                    </>
                )}
                <input type="file" name='file' className='preview-image-file' ref={fileInputRef} onChange={onFileSelect} />
            </div>
            <div className="preview-image-container">
                {images.map((image: ImageType, index: number) => (
                    <div className="preview-image-image" key={index}>
                        <span onClick={() => handleOnDelete(index)} className='preview-image-delete'>&times;</span>
                        <img src={image.url} alt={image.name} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DragFileAndPreview;
