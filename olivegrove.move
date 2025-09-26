module first_package::olivegrove {
    use iota::object::{Self, UID};
    use iota::tx_context::{Self, TxContext};
    use iota::transfer;
    use std::string::{Self, String};

    public struct OliveGrove has key, store {
        id: UID,
        data: OliveGroveData
    }

    public struct OliveGroveData has drop, copy, store {
        organization_pattern: String,
        latitude_microdeg: String,
        longitude_microdeg: String,
        olive_variety_code: String,
        planting_year: String,
        soil_ph: String,
        soil_moisture_percent: String,
        soil_ec: String,
        fertilizer_date: String,
        fertilizer_type: String,
        fertilizer_amount: String,
        irrigation_type: String,
        irrigation_amount: String,
        rainfall: String,
        temperature_celsius: String,
        humidity_percent: String,
        pest_control_date: String,
        pest_control_type: String,
        labor_worker_id: String,
        labor_hours_worked: String,
        cost_per_hectare_mad: String,
        olive_quantity_kg: String,
    }

    public entry fun create_and_transfer_olive_grove(
        organization_pattern: String,
        latitude_microdeg: String,
        longitude_microdeg: String,
        olive_variety_code: String,
        planting_year: String,
        soil_ph: String,
        soil_moisture_percent: String,
        soil_ec: String,
        fertilizer_date: String,
        fertilizer_type: String,
        fertilizer_amount: String,
        irrigation_type: String,
        irrigation_amount: String,
        rainfall: String,
        temperature_celsius: String,
        humidity_percent: String,
        pest_control_date: String,
        pest_control_type: String,
        labor_worker_id: String,
        labor_hours_worked: String,
        cost_per_hectare_mad: String,
        olive_quantity_kg: String,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let grove = OliveGrove {
            id: object::new(ctx),
            data: OliveGroveData {
                organization_pattern,
                latitude_microdeg,
                longitude_microdeg,
                olive_variety_code,
                planting_year,
                soil_ph,
                soil_moisture_percent,
                soil_ec,
                fertilizer_date,
                fertilizer_type,
                fertilizer_amount,
                irrigation_type,
                irrigation_amount,
                rainfall,
                temperature_celsius,
                humidity_percent,
                pest_control_date,
                pest_control_type,
                labor_worker_id,
                labor_hours_worked,
                cost_per_hectare_mad,
                olive_quantity_kg,
            }
        };
        transfer::transfer(grove, recipient);
    }

    public fun get_olive_grove_data(grove: &OliveGrove): OliveGroveData {
        grove.data
    }
}

module first_package::harvest {
    use iota::object::{Self, UID};
    use iota::tx_context::{Self, TxContext};
    use iota::transfer;
    use std::string::{Self, String};

    public struct Harvest has key, store {
        id: UID,
        data: HarvestData
    }

    public struct HarvestData has drop, copy, store {
        organization_pattern: String,
        harvest_date: String,
        vehicle_id: String,
        labor_worker_id: String,
        labor_hours_worked: String,
        harvesting_cost_mad: String,
        harvested_quantity_kg: String,
    }

    public entry fun create_and_transfer_harvest(
        organization_pattern: String,
        harvest_date: String,
        vehicle_id: String,
        labor_worker_id: String,
        labor_hours_worked: String,
        harvesting_cost_mad: String,
        harvested_quantity_kg: String,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let harvest = Harvest {
            id: object::new(ctx),
            data: HarvestData {
                organization_pattern,
                harvest_date,
                vehicle_id,
                labor_worker_id,
                labor_hours_worked,
                harvesting_cost_mad,
                harvested_quantity_kg,
            }
        };
        transfer::transfer(harvest, recipient);
    }

    public fun get_harvest_data(harvest: &Harvest): HarvestData {
        harvest.data
    }
}

module first_package::processing {
    use iota::object::{Self, UID};
    use iota::tx_context::{Self, TxContext};
    use iota::transfer;
    use std::string::{Self, String};

    public struct Processing has key, store {
        id: UID,
        data: ProcessingData
    }

    public struct ProcessingData has drop, copy, store {
        organization_pattern: String,
        press_method: String,
        temperature_celsius: String,
        labor_worker_id: String,
        labor_hours_worked: String,
        processing_cost_mad: String,
        oil_yield_liters: String,
    }

    public entry fun create_and_transfer_processing(
        organization_pattern: String,
        press_method: String,
        temperature_celsius: String,
        labor_worker_id: String,
        labor_hours_worked: String,
        processing_cost_mad: String,
        oil_yield_liters: String,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let processing = Processing {
            id: object::new(ctx),
            data: ProcessingData {
                organization_pattern,
                press_method,
                temperature_celsius,
                labor_worker_id,
                labor_hours_worked,
                processing_cost_mad,
                oil_yield_liters,
            }
        };
        transfer::transfer(processing, recipient);
    }

    public fun get_processing_data(processing: &Processing): ProcessingData {
        processing.data
    }
}

module first_package::packaging {
    use iota::object::{Self, UID};
    use iota::tx_context::{Self, TxContext};
    use iota::transfer;
    use std::string::{Self, String};

    public struct Packaging has key, store {
        id: UID,
        data: PackagingData
    }

    public struct PackagingData has drop, copy, store {
        organization_pattern: String,
        seal_status: String,
        packaging_date: String,
        labor_worker_id: String,
        packaging_cost_mad: String,
        bottles_produced: String,
    }

    public entry fun create_and_transfer_packaging(
        organization_pattern: String,
        seal_status: String,
        packaging_date: String,
        labor_worker_id: String,
        packaging_cost_mad: String,
        bottles_produced: String,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let packaging = Packaging {
            id: object::new(ctx),
            data: PackagingData {
                organization_pattern,
                seal_status,
                packaging_date,
                labor_worker_id,
                packaging_cost_mad,
                bottles_produced,
            }
        };
        transfer::transfer(packaging, recipient);
    }

    public fun get_packaging_data(packaging: &Packaging): PackagingData {
        packaging.data
    }
}

module first_package::qualitycontrol {
    use iota::object::{Self, UID};
    use iota::tx_context::{Self, TxContext};
    use iota::transfer;
    use std::string::{Self, String};

    public struct QualityControl has key, store {
        id: UID,
        data: QualityControlData
    }

    public struct QualityControlData has drop, copy, store {
        organization_pattern: String,
        qc_passed: String,
        qc_date: String,
        qc_inspector_id: String,
        qc_cost_mad: String,
    }

    public entry fun create_and_transfer_quality_control(
        organization_pattern: String,
        qc_passed: String,
        qc_date: String,
        qc_inspector_id: String,
        qc_cost_mad: String,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let quality_control = QualityControl {
            id: object::new(ctx),
            data: QualityControlData {
                organization_pattern,
                qc_passed,
                qc_date,
                qc_inspector_id,
                qc_cost_mad,
            }
        };
        transfer::transfer(quality_control, recipient);
    }

    public fun get_quality_control_data(qc: &QualityControl): QualityControlData {
        qc.data
    }
}

module first_package::retailer {
    use iota::object::{Self, UID};
    use iota::tx_context::{Self, TxContext};
    use iota::transfer;
    use std::string::{Self, String};

    public struct Retailer has key, store {
        id: UID,
        data: RetailerData
    }

    public struct RetailerData has drop, copy, store {
        organization_pattern: String,
        shelf_position: String,
        retailer_arrival_date: String,
        retailer_feedback_score: String,
        retail_markup_percent: String,
        price_per_bottle_mad: String,
    }

    public entry fun create_and_transfer_retailer(
        organization_pattern: String,
        shelf_position: String,
        retailer_arrival_date: String,
        retailer_feedback_score: String,
        retail_markup_percent: String,
        price_per_bottle_mad: String,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let retailer = Retailer {
            id: object::new(ctx),
            data: RetailerData {
                organization_pattern,
                shelf_position,
                retailer_arrival_date,
                retailer_feedback_score,
                retail_markup_percent,
                price_per_bottle_mad,
            }
        };
        transfer::transfer(retailer, recipient);
    }

    public fun get_retailer_data(retailer: &Retailer): RetailerData {
        retailer.data
    }
}

module first_package::distributor {
    use iota::object::{Self, UID};
    use iota::tx_context::{Self, TxContext};
    use iota::transfer;
    use std::string::{Self, String};

    public struct Distributor has key, store {
        id: UID,
        data: DistributorData
    }

    public struct DistributorData has drop, copy, store {
        organization_pattern: String,
        distributor_location: String,
        distributor_shipment_id: String,
        distributor_date: String,
        shipping_cost_mad: String,
    }

    public entry fun create_and_transfer_distributor(
        organization_pattern: String,
        distributor_location: String,
        distributor_shipment_id: String,
        distributor_date: String,
        shipping_cost_mad: String,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let distributor = Distributor {
            id: object::new(ctx),
            data: DistributorData {
                organization_pattern,
                distributor_location,
                distributor_shipment_id,
                distributor_date,
                shipping_cost_mad,
            }
        };
        transfer::transfer(distributor, recipient);
    }

    public fun get_distributor_data(distributor: &Distributor): DistributorData {
        distributor.data
    }
}
