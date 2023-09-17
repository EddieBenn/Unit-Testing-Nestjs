import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from 'src/payments/dto/createPayment.dto';

@Injectable()
export class PaymentsService {
  private users = [
    {
      email: 'luckydube@gmail.com',
    },
    {
      email: 'rachaelventures@gmail.com',
    },
    {
      email: 'lizzycakes@gmail.com',
    },
  ];
  async createPayment(createPaymentDto: CreatePaymentDto) {
    const { email } = createPaymentDto;
    const user = this.users.find((user) => user.email === email);

    if (user) {
      return {
        status: 'success',
      };
    } else {
      throw new BadRequestException();
    }
  }
}
