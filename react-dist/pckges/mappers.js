export class PrescriptionPackagesMapper {
  static toFormDataFromFormInputs(data) {
    return {
      name: data.name,
      description: data.description,
      relatedTo: data.relatedTo,
      cie11Code: ""
    };
  }
}