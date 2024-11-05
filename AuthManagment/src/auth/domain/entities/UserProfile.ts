import { IsNotEmpty, IsOptional } from 'class-validator';

export class UserProfile {
    @IsOptional()
    profileurl?: string;

    @IsOptional()
    profilefilenames?: string[];

    @IsOptional()
    address?: string;

    @IsOptional()
    workexperience?: string;

    @IsOptional()
    standardprice?: number;

    @IsOptional()
    hourlyrate?: number;

    @IsOptional()
    selectedservices?: string[];

    constructor(
        profileurl?: string,
        profilefilenames?: string[],
        address?: string,
        workexperience?: string,
        standardprice?: number,
        hourlyrate?: number,
        selectedservices?: string[]
    ) {
        this.profileurl = profileurl;
        this.profilefilenames = profilefilenames;
        this.address = address;
        this.workexperience = workexperience;
        this.standardprice = standardprice;
        this.hourlyrate = hourlyrate;
        this.selectedservices = selectedservices;
    }
}
