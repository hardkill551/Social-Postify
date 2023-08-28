import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator"

export class ListAllEntities {
    @IsString()
    @IsOptional()
    published?:string

    @IsString()
    @IsOptional()
    after?:string

}