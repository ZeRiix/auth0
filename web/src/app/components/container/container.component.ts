import { getZodOutput } from 'src/app/utils/zod';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { folderSchema } from 'src/app/shared/schema/folder.schema';
import { fileSchema } from 'src/app/shared/schema/file.schema';
import { permissionSchema } from 'src/app/shared/schema/permissions.schema';

const FILE_COLUMNS_MAX = 8;
const FILE_COLUMNS_MIN = 4;

@Component({
    selector: 'app-container',
    templateUrl: './container.component.html',
    styleUrls: ['./container.component.scss'],
})
export class Container implements OnInit {
    // Inputs
    @Input() folder: getZodOutput<typeof folderSchema> | undefined;
    @Input() files: Array<getZodOutput<typeof folderSchema>> | undefined = [];
    @Input() permissions: getZodOutput<typeof permissionSchema> | undefined = undefined;
    @Input() selectedFiles: Array<getZodOutput<typeof fileSchema>> | undefined = [];
    @Input() selectedFolders: Array<getZodOutput<typeof folderSchema>> | undefined = [];
    // @Outputs
    @Output() folderChange = new EventEmitter<getZodOutput<typeof folderSchema>>();
    @Output() filesChange = new EventEmitter<Array<getZodOutput<typeof folderSchema>>>();
    @Output() downloadFile = new EventEmitter<getZodOutput<typeof fileSchema>>();
    @Output() deleteFile = new EventEmitter<getZodOutput<typeof fileSchema>>();
    @Output() deleteFolder = new EventEmitter<getZodOutput<typeof folderSchema>>();
    @Output() renameFile = new EventEmitter<getZodOutput<typeof fileSchema>>();
    @Output() renameFolder = new EventEmitter<getZodOutput<typeof folderSchema>>();
    @Output() shareFile = new EventEmitter<getZodOutput<typeof fileSchema>>();
    @Output() shareFolder = new EventEmitter<getZodOutput<typeof folderSchema>>();
    @Output() createFolder = new EventEmitter<void>();
    @Output() uploadFile = new EventEmitter<File>();
    @Output() moveFile = new EventEmitter<getZodOutput<typeof fileSchema>>();
    @Output() moveFolder = new EventEmitter<getZodOutput<typeof folderSchema>>();
    @Output() copyFile = new EventEmitter<getZodOutput<typeof fileSchema>>();
    @Output() copyFolder = new EventEmitter<getZodOutput<typeof folderSchema>>();
    @Output() selectFile = new EventEmitter<getZodOutput<typeof fileSchema>>();
    @Output() selectFolder = new EventEmitter<getZodOutput<typeof folderSchema>>();
    @Output() selectAll = new EventEmitter<void>();
    @Output() unselectAll = new EventEmitter<void>();
    @Output() downloadSelectedFiles = new EventEmitter<void>();
    @Output() deleteSelectedFiles = new EventEmitter<void>();

    // Variables
    nbCols: number = FILE_COLUMNS_MAX;
    selectedItems: Array<any> = [];

    ngOnInit(): void {
        this.handleResize();
    }

    handleResize(): void {
        this.nbCols = window.innerWidth <= 1024 ? FILE_COLUMNS_MIN : FILE_COLUMNS_MAX;
    }

    viewMode: 'list' | 'grid' | 'preview' = 'list';

    setViewMode(mode: 'list' | 'grid' | 'preview'): void {
        this.viewMode = mode;
    }

    isSelected(item: any): boolean {
        return this.selectedItems.includes(item);
    }

    toggleSelection(item: any): void {
        if (this.isSelected(item)) {
            const index = this.selectedItems.indexOf(item);
            this.selectedItems.splice(index, 1);
        } else {
            this.selectedItems.push(item);
        }
        // Si vous souhaitez émettre un événement à chaque changement de sélection, ajoutez-le ici.
    }
}
