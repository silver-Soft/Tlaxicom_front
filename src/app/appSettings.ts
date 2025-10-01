import { HttpHeaders } from '@angular/common/http';

export class AppSettings {

    public static API_ENDPOINT = 'http://localhost:8080';
    public static token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzbHBlenJvbWFuby5zbEBnbWFpbC5jb20iLCJyb2xlIjoxLCJpYXQiOjE3NTg3NDExMTIsImV4cCI6MTc1ODgyNzUxMn0.NUVnZbh_btaTeHaYjn66klCBYjlLSzPtUGh_Mtutang"
    public static TITLE = 'TLAXICOM';
    public static SLOGAN = 'Velocidad y Confianza en un solo lugar';
    public static COPYRIGHT = 'Copyright © 2025 - Todos los derechos reservados';

    public static CODE_LOST_REQUEST = 0;
    public static CODE_WRONG_REQUEST = 400;
    public static CODE_WITHOUT_AUTHORIZATION = 401;
    public static CODE_OK = 200;

    public static HEADERS = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Access-Control-Allow-Credentials' : 'true',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
          })
    };
}
