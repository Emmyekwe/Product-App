import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Product } from "../model/products";

@Injectable({providedIn: "root"})
export class ProductService {

    error = new Subject<string>()

    constructor(private http: HttpClient) {

    }
    
    createProduct(products: {pName: string, desc: string, price: string}) {
        console.log(products)
        const headers = new HttpHeaders({'myHeader': 'Emmyekwe'})
        this.http.post<{name: string}>('https://angulartut-61def-default-rtdb.firebaseio.com/products.json', products, {headers: headers})
        .subscribe((res) => {
        console.log(res)
        }, (err) => {
            this.error.next(err.message)
        }
        )
    }

    fetchProduct() {
        const header = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', '*')
       return this.http.get<{[ key: string ]: Product }>('https://angulartut-61def-default-rtdb.firebaseio.com/products.json',
            {headers: header})
        .pipe(map((res) => {
        const products = [];
        for (const key in res) {
            if(res.hasOwnProperty(key)) {
            products.push({...res[key], id: key})
            }
        }
        return products;
        }), catchError((err) => {
            return throwError(err)
        }))
    }

    deleteProduct(id: string) {
        let header = new HttpHeaders();
        header = header.append('myHeader1', 'value1');
        header = header.append('myHeader2', 'value2');
        this.http.delete('https://angulartut-61def-default-rtdb.firebaseio.com/products/'+id+'.json', {headers: header})
        .subscribe();
    }

    deleteAllProduct() {
        this.http.delete('https://angulartut-61def-default-rtdb.firebaseio.com/products/.json')
        .subscribe();
    }

    updateProduct(id: string, value: Product) {
        this.http.put('https://angulartut-61def-default-rtdb.firebaseio.com/products/'+id+'.json', value)
        .subscribe();
    }
}