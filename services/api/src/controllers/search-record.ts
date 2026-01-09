import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { LogMethod } from '../common/log-method.decorator';
import { SearchRecordService } from '../services/search-record';

@Controller('search-record')
export class SearchRecordController {
  constructor(private readonly searchRecordService: SearchRecordService) {}

  @Post()
  @LogMethod()
  async addRecord(@Req() req: any, @Body('keyword') keyword: string) {
    const userId = req.user.userId;
    await this.searchRecordService.addRecord(userId, keyword);
    return { code: 200, message: 'success' };
  }

  @Get('history')
  @LogMethod()
  async getHistory(@Req() req: any) {
    const userId = req.user.userId;
    const history = await this.searchRecordService.getUserHistory(userId);
    return { code: 200, data: history };
  }

  @Get('hot')
  @LogMethod()
  async getHot() {
    const hot = await this.searchRecordService.getHotSearches();
    return { code: 200, data: hot };
  }

  @Delete('history')
  @LogMethod()
  async clearHistory(@Req() req: any) {
    const userId = req.user.userId;
    await this.searchRecordService.clearUserHistory(userId);
    return { code: 200, message: 'success' };
  }
}
