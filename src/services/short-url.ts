import { Model } from "mongoose";
import {
  NumberDictionary,
  adjectives,
  animals,
  colors,
  countries,
  languages,
  names,
  starWars,
  uniqueNamesGenerator
} from "unique-names-generator";
import { IShortUrlDocument, ShortUrlModel } from "../models/short-url";
import { TCreateShortUrlRequest } from "../types/short-url";
import { AppError } from "../utils/app-error";
  
  /**
   * Service to handle short URL operations.
   */
  class ShortUrlService {
    model: Model<IShortUrlDocument>;
  
    constructor(model: Model<IShortUrlDocument>) {
      this.model = model;
    }
  
    /**
     * Generates a unique custom alias using predefined dictionaries.
     * Ensures the alias does not already exist in the database.
     * @returns A randomly generated unique alias string.
     */
    private async customAliasGenerator(): Promise<string> {
      const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
  
      while (true) {
        const randomAlias: string = uniqueNamesGenerator({
          dictionaries: [
            adjectives,
            colors,
            animals,
            countries,
            names,
            languages,
            starWars,
            numberDictionary,
          ],
          length: 2,
          separator: "",
          style: "capital",
        });
  
        const existingAlias = await this.model.findOne({ customAlias: randomAlias });
        if (!existingAlias) {
          return randomAlias;
        }
      }
    }
  
    /**
     * Creates a short URL using the provided request data.
     * @param request - The request data for creating a short URL.
     * @returns The created short URL document.
     */
    public async createShortUrl(
      request: TCreateShortUrlRequest
    ): Promise<IShortUrlDocument> {
      // Check if the provided alias already exists
      if (request.customAlias) {
        const existingAlias = await this.model.findOne({ customAlias: request.customAlias });
        if (existingAlias) {
          throw new AppError("Alias already exists. Please try again", 409);
        }
      }
  
      // Use provided alias or generate a unique random one
      const alias = request.customAlias || (await this.customAliasGenerator());

      const query: TCreateShortUrlRequest = {
        userId: request.userId,
        longUrl: request.longUrl,
        customAlias: alias
      }

      query.topic = request.topic;

      // Create and save the short URL
      const shortUrlDoc = await this.model.create({
        ...query,
        isCustom: !!request.customAlias
      })
  
      return shortUrlDoc;
    }
  }
  
  export const shortUrlService = new ShortUrlService(ShortUrlModel);
  