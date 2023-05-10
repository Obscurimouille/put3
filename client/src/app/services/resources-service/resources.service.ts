import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable, OnInit } from '@angular/core';
import { FileData } from 'src/app/types/resources/file-data';
import { environment } from 'src/environments/environment';
import { ResourceType } from 'src/app/enums/resources/type';
import { ResourceDirectory } from 'src/app/enums/resources/directory';
import { ResourceSet } from 'src/app/types/resources/data-set';
import { WebSocketService } from '../websocket-service/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

    private apiUrl = environment.serverUrl + environment.apiPath + '/resources';
    private resources: ResourceSet = {};

    constructor(private http: HttpClient, private websocket: WebSocketService) {
        this.update();

        this.websocket.socket.on('event', (data: any) => {
            if (data.type != 'resources') return;
            this.update();
        });
    }

    public update() {
        this.getData().then((resources: ResourceSet) => {
            this.resources = resources;
            console.log(this.resources);
        });
    }

    public removeFileExtension(filename: string) {
        return filename.split('.').slice(0, -1).join('.');
    }

    public typeToDir(type: ResourceType): ResourceDirectory {
        switch (type) {
            case ResourceType.Image:
                return ResourceDirectory.Images;
            case ResourceType.Video:
                return ResourceDirectory.Videos;
            case ResourceType.Audio:
                return ResourceDirectory.Audio;
        }
    }

    public dirToType(dir: ResourceDirectory): ResourceType {
        switch (dir) {
            case ResourceDirectory.Images:
                return ResourceType.Image;
            case ResourceDirectory.Videos:
                return ResourceType.Video;
            case ResourceDirectory.Audio:
                return ResourceType.Audio;
        }
    }

    public flattenObject(obj: any, path: string = '') {
        let result: any[] = [];

        for (let key in obj) {
        let newPath = path ? path + '/' + key : key;

        if (Array.isArray(obj[key])) {
            result = result.concat(obj[key].map((item: any) => newPath + '/' + item));
        }
        else if (typeof obj[key] === 'object') {
            result = result.concat(this.flattenObject(obj[key], newPath));
        }
        }
        return result;
    }

    /**
     * Get all resources data
     * @returns {Promise<ResourceSet>} Resources
     */
    public getData(): Promise<ResourceSet> {
        return new Promise<ResourceSet>((resolve, reject) => {
            this.http.get<ResourceSet>(this.apiUrl, {
                responseType: 'json'
            }).subscribe((data: ResourceSet) => {
                resolve(data);
            });
        });
    }

    /**
     * Get resources data by type
     * @param {ResourceType} type Resource type
     * @returns {Promise<FileData[]>} Resources
     */
    public getDataByType(type: ResourceType): Promise<FileData[]> {
        const endpoint = this.apiUrl + '/' + this.typeToDir(type);

        return new Promise<FileData[]>((resolve, reject) => {
            this.http.get<FileData[]>(endpoint, {
                responseType: 'json'
            }).subscribe((data: FileData[]) => {
                resolve(data);
            });
        });
    }

    public getResources(type: ResourceType | null = null): FileData[] {
        // Return resources of a specific type
        if (type) {
            const dir = this.typeToDir(type);
            return this.resources[dir]!;
        }

        // Return all resources if no type is specified
        return this.flatten();
    }

    public flatten(set: ResourceSet = this.resources) {
        let result: any[] = [];

        for (let files of Object.values(set)) {
            result = result.concat(files);
        }

        return result;
    }

    /**
     * Delete multiple resource files
     * @param {string[]} filespath Path of the files to delete
     * @returns {Promise<any>} Server result
     */
    public delete(filespath: string[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.delete(this.apiUrl, {
                responseType: 'json',
                body: filespath
            })
            .subscribe((data: any) => resolve(data));
        });
    }

    /**
     * Rename a resource file
     * @param {string} currentPath Current relative path
     * @param {string} newPath New relative path
     * @returns {Promise<any>} Server result
     */
    public rename(currentName: string, newName: string, dirpath: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.post(this.apiUrl + '/rename', {
                currentName,
                newName,
                dirpath
            },
            {
                responseType: 'json',
            })
            .subscribe({
                next: (data: any) => resolve(data),
                error: (error: any) => reject(error)
            });
        });
    }

    addFiles(file: File) {
        let arr: any[] = [];
        let formData = new FormData();

        arr.push(file);
        arr[0].forEach((item: any, i: any) => {
            formData.append('file', arr[0][i]);
        })

        return this.http.post(this.apiUrl + '/upload', formData, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            catchError(this.errorMgmt)
        )
    }

    errorMgmt(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        }
        else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }
}
