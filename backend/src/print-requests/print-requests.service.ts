import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePrintRequestDto } from "./dto/create-print-request.dto";
import { PrintRequest } from "./print-request.entity";
import { Printer } from "./printer.entity";
import { ListPrintRequestsDto } from "./dto/list-print-requests.dto";

@Injectable()
export class PrintRequestsService {
  constructor(
    @InjectRepository(PrintRequest) private readonly requests: Repository<PrintRequest>,
    @InjectRepository(Printer) private readonly printers: Repository<Printer>,
  ) {}

  findAll(query: ListPrintRequestsDto): Promise<PrintRequest[]> {
    // TODO: recibir el filtro y aplicarlo en la consulta del repositorio.
    return this.requests.find({ 
      where: query.status ? { status: query.status }: {}, 
      relations: { printer: true }, 
      order: { id: "ASC" } });
  }

  async findOne(id: number) {
    const request = await this.requests.findOne({
      where: { id },
      relations: { printer: true },
    });
    if (!request) throw new NotFoundException("La solicitud no existe.");
    return request;
  }

  async create(dto: CreatePrintRequestDto) {
    const printer = await this.printers.findOneBy({ id: dto.printerId });
    if (!printer) throw new NotFoundException("La impresora no existe.");

    // TODO: aplicar aquí la regla de disponibilidad antes de guardar.
    if(!printer.isAvailable){
      throw new ConflictException("La impresora no esta disponible")
    }

    const request = this.requests.create({
      title: dto.title.trim(),
      pages: dto.pages,
      status: "pending",
      printer,
    });
    return this.requests.save(request);
  }
}
