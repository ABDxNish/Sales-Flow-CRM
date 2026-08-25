export type Role='ADMIN'|'MANAGER'|'SALES';
export interface User { id:string;name:string;email:string;role:Role;phone?:string; }
export interface Company {id:string;name:string;industry?:string;website?:string;phone?:string;email?:string;address?:string;contacts?:Contact[];}
export interface Contact {id:string;firstName:string;lastName:string;email?:string;phone?:string;position?:string;company?:Company|null;}
export type LeadStatus='NEW'|'CONTACTED'|'QUALIFIED'|'CONVERTED'|'LOST';
export interface Lead {id:string;title:string;source?:string;estimatedValue:number;status:LeadStatus;description?:string;company?:Company|null;contact?:Contact|null;assignedTo?:User|null;notes?:Note[];activities?:Activity[];}
export type DealStage='NEW'|'CONTACTED'|'PROPOSAL'|'NEGOTIATION'|'WON'|'LOST';
export interface DealHistory {id:string;action:string;fromStage?:DealStage|null;toStage?:DealStage|null;changedBy?:User|null;createdAt:string;}
export interface Deal {id:string;title:string;value:number;stage:DealStage;expectedCloseDate?:string;description?:string;company?:Company|null;contact?:Contact|null;assignedTo?:User|null;notes?:Note[];activities?:Activity[];history?:DealHistory[];updatedAt?:string;}
export type ActivityType='CALL'|'EMAIL'|'MEETING'|'FOLLOW_UP'|'NOTE';
export interface Activity {id:string;title:string;type:ActivityType;description?:string;dueDate?:string;completed:boolean;assignedTo?:User|null;lead?:Lead|null;deal?:Deal|null;}
export interface Note {id:string;content:string;createdBy?:User|null;createdAt:string;}
export interface Notification {id:string;title:string;message:string;isRead:boolean;createdAt:string;}
export interface Paginated<T>{data:T[];total:number;page:number;limit:number;}
