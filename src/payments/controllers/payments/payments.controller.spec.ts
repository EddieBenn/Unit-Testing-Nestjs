import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { Request, Response } from 'express';
import { PaymentsService } from 'src/payments/services/payments/payments.service';
import { BadRequestException } from '@nestjs/common';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let paymantsService: PaymentsService;

  const requestMock = {
    query: {},
  } as unknown as Request;

  const statusResponseMock = {
    send: jest.fn((x) => x),
  };

  const responseMock = {
    status: jest.fn((x) => statusResponseMock),
    send: jest.fn((x) => x),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: 'PAYMENT_SERVICE',
          useValue: {
            createPayment: jest.fn((x) => x),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    paymantsService = module.get<PaymentsService>('PAYMENT_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('paymantsService should be defined', () => {
    expect(paymantsService).toBeDefined();
  });

  describe('getPayments', () => {
    it('should return status of 400', async () => {
      await controller.getPayments(requestMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(statusResponseMock.send).toHaveBeenCalledWith({
        message: 'Missing count or page query parameter',
      });
    });
    it('should return statusCode of 200 when query params are present', async () => {
      requestMock.query = {
        count: '10',
        page: '1',
      };
      await controller.getPayments(requestMock, responseMock);
      expect(responseMock.send).toHaveBeenCalledWith(200);
    });
  });

  describe('createPayment', () => {
    // it('it should return a successful response', async () => {
    //   const response = await controller.createPayment({
    //     email: 'faithpeters@gmail.com',
    //     price: 100,
    //   });
    //   expect(response).toStrictEqual({ status: 'success' });
    // });

    it('it should throw an error', async () => {
      jest
        .spyOn(paymantsService, 'createPayment')
        .mockImplementationOnce(() => {
          throw new BadRequestException();
        });
      try {
        const response = await controller.createPayment({
          email: 'faithpeters@gmail.com',
          price: 100,
        });
        return response;
      } catch (error) {
        console.log(error);
      }
    });
  });
});
