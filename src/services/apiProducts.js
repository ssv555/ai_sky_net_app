import apiService from "./apiService.js";

const apiProducts = {
  async commonGet(tg_user_id, date, short_endpoint) {
    const endpoint = `/products/${short_endpoint}/?tg_user_id=${tg_user_id}&date=${date}`;
    return await apiService.get(endpoint);
  },
  async commonPost(params, short_endpoint) {
    const endpoint = `/products/${short_endpoint}/`;
    return await apiService.post(endpoint, params);
  },

  async getDay(tg_user_id, date) {
    try {
      return await this.commonGet(tg_user_id, date, "get_day");
    } catch (error) {
      console.error("apiProducts.getDay. Ошибка:", error);
      throw error;
    }
  },
  async getDaySum(tg_user_id, date) {
    try {
      return await this.commonGet(tg_user_id, date, "get_day_sum");
    } catch (error) {
      console.error("apiProducts.getDaySum. Ошибка:", error);
      throw error;
    }
  },
  async getMonth(tg_user_id, date) {
    try {
      return await this.commonGet(tg_user_id, date, "get_month");
    } catch (error) {
      console.error("apiProducts.getMonth. Ошибка:", error);
      throw error;
    }
  },
  async getMonthSum(tg_user_id, date) {
    try {
      return await this.commonGet(tg_user_id, date, "get_month_sum");
    } catch (error) {
      console.error("apiProducts.getMonthSum. Ошибка:", error);
      throw error;
    }
  },
  async getYear(tg_user_id, date) {
    try {
      return await this.commonGet(tg_user_id, date, "get_year");
    } catch (error) {
      console.error("apiProducts.getYear. Ошибка:", error);
      throw error;
    }
  },
  async getYearSum(tg_user_id, date) {
    try {
      return await this.commonGet(tg_user_id, date, "get_year_sum");
    } catch (error) {
      console.error("apiProducts.getYearSum. Ошибка:", error);
      throw error;
    }
  },

  async doDuplicate(params) {
    try {
      return await this.commonPost(params, "duplicate");
    } catch (error) {
      console.error("apiProducts.doDuplicate. Ошибка:", error);
      throw error;
    }
  },
  async doDelete(params) {
    try {
      return await this.commonPost(params, "delete");
    } catch (error) {
      console.error("apiProducts.doDelete. Ошибка:", error);
      throw error;
    }
  },
};

export default apiProducts;
