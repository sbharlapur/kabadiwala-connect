import { z } from 'zod';
export declare const MaterialCategorySchema: z.ZodEnum<["PCB", "CABLES", "BATTERIES", "CRT_TV", "LCD_LED", "MOTORS_MAGNETS", "MIXED_PLASTICS"]>;
export declare const ConditionGradeSchema: z.ZodEnum<["GOOD", "BROKEN", "BURNT"]>;
export declare const UserRoleSchema: z.ZodEnum<["COLLECTOR", "RECYCLER", "ADMIN"]>;
export declare const CollectorLoginSchema: z.ZodObject<{
    phone: z.ZodString;
    pin: z.ZodOptional<z.ZodString>;
    otp: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    language: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    language: string;
    pin?: string | undefined;
    otp?: string | undefined;
    name?: string | undefined;
}, {
    phone: string;
    pin?: string | undefined;
    otp?: string | undefined;
    name?: string | undefined;
    language?: string | undefined;
}>;
export declare const RecyclerLoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const CreateScrapLotSchema: z.ZodObject<{
    client_uuid: z.ZodOptional<z.ZodString>;
    category: z.ZodEnum<["PCB", "CABLES", "BATTERIES", "CRT_TV", "LCD_LED", "MOTORS_MAGNETS", "MIXED_PLASTICS"]>;
    condition: z.ZodDefault<z.ZodEnum<["GOOD", "BROKEN", "BURNT"]>>;
    weight_kg: z.ZodNumber;
    unit_price: z.ZodNumber;
    confidence_score: z.ZodDefault<z.ZodNumber>;
    photo_urls: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    photo_hashes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    latitude: z.ZodOptional<z.ZodNumber>;
    longitude: z.ZodOptional<z.ZodNumber>;
    location_name: z.ZodOptional<z.ZodString>;
    matched_recycler_id: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category: "PCB" | "CABLES" | "BATTERIES" | "CRT_TV" | "LCD_LED" | "MOTORS_MAGNETS" | "MIXED_PLASTICS";
    condition: "GOOD" | "BROKEN" | "BURNT";
    weight_kg: number;
    unit_price: number;
    confidence_score: number;
    photo_urls: string[];
    photo_hashes: string[];
    client_uuid?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    location_name?: string | undefined;
    matched_recycler_id?: string | undefined;
    notes?: string | undefined;
}, {
    category: "PCB" | "CABLES" | "BATTERIES" | "CRT_TV" | "LCD_LED" | "MOTORS_MAGNETS" | "MIXED_PLASTICS";
    weight_kg: number;
    unit_price: number;
    client_uuid?: string | undefined;
    condition?: "GOOD" | "BROKEN" | "BURNT" | undefined;
    confidence_score?: number | undefined;
    photo_urls?: string[] | undefined;
    photo_hashes?: string[] | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    location_name?: string | undefined;
    matched_recycler_id?: string | undefined;
    notes?: string | undefined;
}>;
export declare const VerifyHandoverSchema: z.ZodObject<{
    qr_token: z.ZodString;
    fallback_code: z.ZodOptional<z.ZodString>;
    actual_weight_kg: z.ZodOptional<z.ZodNumber>;
    actual_condition: z.ZodOptional<z.ZodEnum<["GOOD", "BROKEN", "BURNT"]>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    qr_token: string;
    notes?: string | undefined;
    fallback_code?: string | undefined;
    actual_weight_kg?: number | undefined;
    actual_condition?: "GOOD" | "BROKEN" | "BURNT" | undefined;
}, {
    qr_token: string;
    notes?: string | undefined;
    fallback_code?: string | undefined;
    actual_weight_kg?: number | undefined;
    actual_condition?: "GOOD" | "BROKEN" | "BURNT" | undefined;
}>;
export declare const RateUpdateSchema: z.ZodObject<{
    category: z.ZodEnum<["PCB", "CABLES", "BATTERIES", "CRT_TV", "LCD_LED", "MOTORS_MAGNETS", "MIXED_PLASTICS"]>;
    base_rate_per_kg: z.ZodNumber;
    min_rate_per_kg: z.ZodNumber;
    max_rate_per_kg: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    category: "PCB" | "CABLES" | "BATTERIES" | "CRT_TV" | "LCD_LED" | "MOTORS_MAGNETS" | "MIXED_PLASTICS";
    base_rate_per_kg: number;
    min_rate_per_kg: number;
    max_rate_per_kg: number;
}, {
    category: "PCB" | "CABLES" | "BATTERIES" | "CRT_TV" | "LCD_LED" | "MOTORS_MAGNETS" | "MIXED_PLASTICS";
    base_rate_per_kg: number;
    min_rate_per_kg: number;
    max_rate_per_kg: number;
}>;
