import BaseApiService from "./baseApiService";

export class ExamRecipeResultService extends BaseApiService {
    constructor() {
        super("medical", "exam-recipe-results");
    }
}
