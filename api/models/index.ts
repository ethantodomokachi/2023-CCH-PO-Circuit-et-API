import { RequestHandler } from 'express';
import QueryString from 'qs';
import { Prisma } from '@prisma/client';

export type RouteHandler<SlugParams = unknown, ResBody = unknown, ReqBody = unknown> = RequestHandler<SlugParams, ResBody, ReqBody, QueryString.ParsedQs, Record<string, unknown>>;

export interface RaceToCreate {
  race_start: Date;
  sector1: Date;
  sector2: Date;
  race_finish: Date;
  speed: number;
  id_car: number;
}

export type Activity = {
  id_activity: number,
  label: string
  id_section: number
}

export interface RaceToCreateWithQueryId {
  race_start: Date;
  sector1: Date;
  sector2: Date;
  race_finish: Date;
  speed: number;
  query_id: string;
}

export interface RealisedActivityToCreate {
  id_activity: number;
  query_id: string;
  date_time: Date;
}

export interface CarToUpdate {
  id_car: number;
  pseudo: string;
  avatar: Prisma.JsonObject;
}
