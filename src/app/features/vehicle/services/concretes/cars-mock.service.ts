import { Injectable } from '@angular/core';
import { CarsService } from '../abstracts/cars-service';
import { Observable, Subject } from 'rxjs';
import { GetCarsListRequest } from '../../models/get-cars-list-request';
import { GetCarsListResponse } from '../../models/get-cars-list-response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CarListItemDto } from '../../models/car-list-item-dto';
import { enviroment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarsMockService implements CarsService {
  private readonly apiControllerUrl = `${enviroment.apiUrl}/cars`;

  constructor(private httpClient: HttpClient) {}

  getList(request: GetCarsListRequest): Observable<GetCarsListResponse> {
    const subject: Subject<GetCarsListResponse> =
      new Subject<GetCarsListResponse>();

    const params = new HttpParams(); // Query string parameters
    params.set('_page', request.pageIndex);
    params.set('_limit', request.pageSize);
    if (request.brandId != null) params.set('model.brandId', request.brandId);

    this.httpClient
      .get<CarListItemDto[]>(this.apiControllerUrl, {
        params, //= params: params
      })
      .subscribe({
        next: (data) => { // İşlem başarılı olduğunda
          const response: GetCarsListResponse = {
            pageIndex: request.pageIndex,
            pageSize: request.pageSize,
            count: data.length,
            hasNextPage: true,
            hasPreviousPage: true,
            items: data,
          };

          subject.next(response);
        },
        error: (error) => { // İşlem başarısız olduğunda, error oluştuğunda
          subject.error(error);
        },
        complete: () => { // İzlediğimiz (subscribe olduğumuz) subject tamamlanıp kapandığında
          subject.complete();
        },
      });

    return subject.asObservable();
  }
}
