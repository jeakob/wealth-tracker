import { Controller, Get } from '@nestjs/common';

@Controller('investments')
export class InvestmentsController {
  @Get()
  findAll() {
    // TODO: Fetch investments from DB
    return [
      { id: 1, asset_type: 'Stock', asset_name: 'AAPL', amount: 10, value: 2000 },
      { id: 2, asset_type: 'Bond', asset_name: 'US Treasury', amount: 5, value: 1000 },
    ];
  }
}
