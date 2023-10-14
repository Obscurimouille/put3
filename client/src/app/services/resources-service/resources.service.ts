import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { FileData } from 'src/app/types/resources/file-data';
import { ResourceType } from 'src/app/enums/resources/type';
import { ResourceDirectory } from 'src/app/enums/resources/directory';
import { ResourceSet } from 'src/app/types/resources/data-set';
import { BackendService } from '../backend/backend.service';
import { EventService } from '../event-service/event.service';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

    private routeUrl = this.backend.apiUrl + '/resources';
    private resources: ResourceSet = {};

    constructor(
        private http: HttpClient,
        private backend: BackendService,
        private eventService: EventService
    ) {
        this.update();
        this.eventService.onResourcesUpdate.subscribe((resources) => {
            this.resources = resources;
        });
    }

    public async update() {
        // const logged = await this.authService.isLogged();
        // if (!logged) return;

        this.getData().then((resources: ResourceSet) => {
            this.resources = resources;
        });
    }

    public typeToDir(type: ResourceType): ResourceDirectory {
        switch (type) {
            case ResourceType.Image: return ResourceDirectory.Images;
            case ResourceType.Video: return ResourceDirectory.Videos;
            case ResourceType.Audio: return ResourceDirectory.Audios;
        }
    }

    public dirToType(dir: ResourceDirectory): ResourceType {
        switch (dir) {
            case ResourceDirectory.Images: return ResourceType.Image;
            case ResourceDirectory.Videos: return ResourceType.Video;
            case ResourceDirectory.Audios: return ResourceType.Audio;
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
            this.http.get<ResourceSet>(this.routeUrl, {
                responseType: 'json',
                withCredentials: true
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
        const endpoint = this.routeUrl + '/' + this.typeToDir(type);

        return new Promise<FileData[]>((resolve, reject) => {
            this.http.get<FileData[]>(endpoint, {
                responseType: 'json',
                withCredentials: true
            }).subscribe((data: FileData[]) => {
                resolve(data);
            });
        });
    }

    public getResources(type?: ResourceType): FileData[] {
        // Return resources of a specific type
        if (type) {
            const dir = this.typeToDir(type);
            return this.resources[dir] || [];
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
            this.http.delete(this.routeUrl, {
                responseType: 'json',
                body: filespath,
                withCredentials: true
            })
            .subscribe((data: any) => resolve(data));
        });
    }

    public exists(file: FileData | string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let path = typeof file === 'string' ? file : file.href;
            this.http.get(this.backend.serverUrl + '/' + path, {
                responseType: 'blob'
            }).subscribe({
                next: () => resolve(true),
                error: () =>  resolve(false)
            });
        });
    }

    /**
     * Rename a resource file
     * @param {string} currentName Current file name
     * @param {string} newName New file name
     * @param {string} dirpath Directory path
     * @returns {Promise<any>} Server result
     */
    public rename(currentName: string, newName: string, dirpath: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.post(this.routeUrl + '/rename', {
                currentName,
                newName,
                dirpath,
            },
            {
                responseType: 'json',
                withCredentials: true
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

        return this.http.post(this.routeUrl + '/upload', formData, {
            reportProgress: true,
            observe: 'events',
            withCredentials: true
        }).pipe(
            catchError(this.errorMgmt)
        )
    }

    errorMgmt(error: HttpErrorResponse) {
        let errorMessage = '';
        // Get client-side error
        if (error.error instanceof ErrorEvent) errorMessage = error.error.message;
        // Get server-side error
        else errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

        return throwError(errorMessage);
    }
}
