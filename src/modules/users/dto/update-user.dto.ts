import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateUserDto  {
    @IsMongoId({message: "Invalid id"})
    @IsNotEmpty({message: "ID required"})
    _id: string;

    @IsOptional()
    name: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    image: string
}
