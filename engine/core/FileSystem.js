// B"H

/**
 * The Archiver. 
 * Implements an uncompressed ZIP (Store method) writer from scratch.
 * Because we rely on the Divine will, not external libraries.
 */
class ZipWriter {
    constructor() {
        this.files = [];
    }

    add(name, data) {
        // data can be string or Uint8Array
        let content;
        if (typeof data === 'string') {
            content = new TextEncoder().encode(data);
        } else {
            content = data;
        }
        this.files.push({ name, content });
    }

    async generate() {
        // Calculate size
        let centralDirectorySize = 0;
        let offset = 0;
        const records = [];

        // Local File Headers & Data
        const parts = [];
        
        for (const file of this.files) {
            const nameBytes = new TextEncoder().encode(file.name);
            const crc = this.crc32(file.content);
            const size = file.content.length;
            
            // Local Header (30 bytes + name)
            const header = new Uint8Array(30 + nameBytes.length);
            const view = new DataView(header.buffer);
            
            view.setUint32(0, 0x04034b50, true); // Signature
            view.setUint16(4, 0x000A, true); // Version
            view.setUint16(6, 0x0000, true); // Flags
            view.setUint16(8, 0x0000, true); // Compression (Store)
            view.setUint16(10, 0x0000, true); // Time (placeholder)
            view.setUint16(12, 0x0000, true); // Date
            view.setUint32(14, crc, true); // CRC32
            view.setUint32(18, size, true); // Compressed Size
            view.setUint32(22, size, true); // Uncompressed Size
            view.setUint16(26, nameBytes.length, true); // Name Len
            view.setUint16(28, 0, true); // Extra Len
            
            header.set(nameBytes, 30);
            
            records.push({
                nameBytes,
                crc,
                size,
                offset
            });

            parts.push(header);
            parts.push(file.content);
            
            offset += header.length + size;
        }

        const centralDirStart = offset;

        // Central Directory
        for (const rec of records) {
            const header = new Uint8Array(46 + rec.nameBytes.length);
            const view = new DataView(header.buffer);
            
            view.setUint32(0, 0x02014b50, true); // Signature
            view.setUint16(4, 0x000A, true); // Version made by
            view.setUint16(6, 0x000A, true); // Version needed
            view.setUint16(8, 0x0000, true); // Flags
            view.setUint16(10, 0x0000, true); // Compression
            view.setUint16(12, 0x0000, true); // Time
            view.setUint16(14, 0x0000, true); // Date
            view.setUint32(16, rec.crc, true); // CRC
            view.setUint32(20, rec.size, true); // Comp Size
            view.setUint32(24, rec.size, true); // Uncomp Size
            view.setUint16(28, rec.nameBytes.length, true); // Name Len
            view.setUint16(30, 0, true); // Extra
            view.setUint16(32, 0, true); // Comment
            view.setUint16(34, 0, true); // Disk
            view.setUint16(36, 0, true); // Attrs
            view.setUint32(38, 0, true); // Attrs
            view.setUint32(42, rec.offset, true); // Offset
            
            header.set(rec.nameBytes, 46);
            parts.push(header);
            centralDirectorySize += header.length;
        }

        // End of Central Directory
        const eocd = new Uint8Array(22);
        const eocdView = new DataView(eocd.buffer);
        eocdView.setUint32(0, 0x06054b50, true); // Signature
        eocdView.setUint16(4, 0, true); // Disk
        eocdView.setUint16(6, 0, true); // Disk
        eocdView.setUint16(8, records.length, true); // Records on disk
        eocdView.setUint16(10, records.length, true); // Total records
        eocdView.setUint32(12, centralDirectorySize, true); // Size of CD
        eocdView.setUint32(16, centralDirStart, true); // Offset of CD
        eocdView.setUint16(20, 0, true); // Comment len
        parts.push(eocd);

        return new Blob(parts, { type: 'application/zip' });
    }

    crc32(data) {
        let crc = 0xFFFFFFFF;
        for (let i = 0; i < data.length; i++) {
            crc ^= data[i];
            for (let j = 0; j < 8; j++) {
                crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
            }
        }
        return (crc ^ 0xFFFFFFFF) >>> 0;
    }
}

export const FileSystem = {
    // Native Handle
    projectHandle: null,

    // Open Directory
    async openProject() {
        try {
            const handle = await window.showDirectoryPicker();
            this.projectHandle = handle;
            return handle;
        } catch (e) {
            console.error("Access denied by the realm.", e);
            return null;
        }
    },

    // Save entire project as Structure
    async saveProject(project) {
        if (!this.projectHandle) {
             // Fallback to simple download if no handle
             const blob = new Blob([JSON.stringify(project, null, 2)], {type : 'application/json'});
             const url = URL.createObjectURL(blob);
             const a = document.createElement('a');
             a.href = url;
             a.download = `${project.title}.json`;
             a.click();
             return;
        }

        // Write Project JSON
        const fileHandle = await this.projectHandle.getFileHandle('project.json', { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(project, null, 2));
        await writable.close();
    },

    // Export .divine (ZIP)
    async exportPackage(project) {
        const zip = new ZipWriter();
        
        // Add Manifesto
        zip.add('manifest.json', JSON.stringify(project, null, 2));
        
        // Add Assets (simulated for now, would iterate project audio blobs)
        // zip.add('audio/track1.wav', audioData);
        
        const blob = await zip.generate();
        
        if (window.showSaveFilePicker) {
            const handle = await window.showSaveFilePicker({
                suggestedName: `${project.title}.divine`,
                types: [{
                    description: 'Divine Package',
                    accept: {'application/zip': ['.divine']}
                }]
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
        } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project.title}.divine`;
            a.click();
        }
    }
};
