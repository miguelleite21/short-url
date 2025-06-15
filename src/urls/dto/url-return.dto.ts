import { ShortUrl } from "../entities/url.entity";

export interface FormattedUrl extends Omit<ShortUrl, "createdAt" | "updatedAt"> {
	createdAt: string;
	updatedAt: string;
}

export type FormattedCreateUrl = Omit<ShortUrl, "createdAt"> & {
	createdAt: string;
};
