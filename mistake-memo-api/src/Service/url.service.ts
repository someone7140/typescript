import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import cheerio from 'cheerio';

@Injectable()
export class UrlService {
  constructor(private readonly httpService: HttpService) {}

  async getSiteNameFromUrl(url: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get<string>(url).pipe(
        catchError(() => {
          throw new HttpException('Can not get HTML', HttpStatus.BAD_REQUEST);
        }),
      ),
    );
    const loadedHtml = cheerio.load(data);
    const siteName = loadedHtml("meta[property='og:title']").attr('content');
    return siteName;
  }
}
