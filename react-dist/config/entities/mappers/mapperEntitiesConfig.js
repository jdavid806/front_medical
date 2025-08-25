export const EntitiesapperCreate = data => {
  return {
    name: data.name,
    entity_code: data.entity_code,
    document_type: data.document_type,
    document_number: data.document_number.toString(),
    email: data.email,
    address: data.address,
    phone: data.phone,
    city_id: data.city_id,
    country_id: data.department_id,
    department_id: data.department_id,
    tax_charge_id: data.tax_charge_id ?? null,
    withholding_tax_id: data.withholding_tax_id ?? null,
    koneksi_sponsor_slug: data.koneksi_sponsor_slug ?? null
  };
};
export const TaxMapperUpdate = data => {
  return {
    name: data.name,
    entity_code: data.entity_code,
    document_type: data.document_type,
    document_number: data.document_number,
    email: data.email,
    address: data.address,
    phone: data.phone,
    city_id: data.city_id,
    country_id: data.department_id,
    department_id: data.department_id,
    tax_charge_id: data.tax_charge_id ?? null,
    withholding_tax_id: data.withholding_tax_id ?? null,
    koneksi_sponsor_slug: data.koneksi_sponsor_slug ?? null
  };
};