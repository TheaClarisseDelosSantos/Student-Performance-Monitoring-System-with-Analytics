import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class PostProvider {
    server: string = "http://localhost/Student-Performance-Monitoring-System-with-Analytics/App/src/server_api/file_aksi.php";

    constructor(public http: HttpClient){

    }
    postData(body: any, file: string){
        let type = "application/json; charset=UTF-8";
        let headers = new HttpHeaders({'Content-Type': type});

        return this.http.post(this.server + "/" + file, JSON.stringify(body), { headers: headers });

    }
}   