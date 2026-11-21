import { IsIn, IsOptional, IsString } from "class-validator";
import type { PrintStatus } from "../print-request.entity";

export class ListPrintRequestsDto {
  // TODO: validar el parámetro opcional status de acuerdo con el enunciado.
  @IsString()
  @IsOptional()
  @IsIn(['pending', 'printed'])
  status?: PrintStatus;
}
