import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { requestValidationPipe } from "../common/request-validation.pipe";
import { CreatePrintRequestDto } from "./dto/create-print-request.dto";
import { PrintRequestsService } from "./print-requests.service";

@UseGuards(AuthGuard("jwt"))
@Controller("print-requests")
export class PrintRequestsController {
  constructor(private readonly service: PrintRequestsService) {}

  @Get()
  findAll() {
    // TODO: recibir la consulta con @Query, aplicar el pipe y pasar status al servicio.
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body(requestValidationPipe) dto: CreatePrintRequestDto) {
    return this.service.create(dto);
  }
}
