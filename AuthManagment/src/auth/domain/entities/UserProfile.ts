import { IsNotEmpty, IsOptional } from 'class-validator';

export class UserProfile {
    @IsOptional()
    profileurl?: string;

    @IsOptional()
    images?: string[];

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

    @IsOptional()
    ranking?: number;

    constructor(
        profileurl?: string,
        images?: string[],
        address?: string,
        workexperience?: string,
        standardprice?: number,
        hourlyrate?: number,
        selectedservices?: string[],
        ranking?: number
    ) {
        this.profileurl = profileurl;
        this.images = images;
        this.address = address;
        this.workexperience = workexperience;
        this.standardprice = standardprice;
        this.hourlyrate = hourlyrate;
        this.selectedservices = selectedservices;
        this.ranking = ranking;
    }
}
