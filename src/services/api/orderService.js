import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
  async getAll() {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('order_c', {
        fields: [
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "shipping_address_first_name_c"}},
          {"field": {"Name": "shipping_address_last_name_c"}},
          {"field": {"Name": "shipping_address_address_c"}},
          {"field": {"Name": "shipping_address_city_c"}},
          {"field": {"Name": "shipping_address_state_c"}},
          {"field": {"Name": "shipping_address_zip_code_c"}},
          {"field": {"Name": "shipping_address_country_c"}},
          {"field": {"Name": "billing_info_email_c"}},
          {"field": {"Name": "billing_info_phone_c"}},
          {"field": {"Name": "billing_info_address_c"}},
          {"field": {"Name": "billing_info_city_c"}},
          {"field": {"Name": "billing_info_state_c"}},
          {"field": {"Name": "billing_info_zip_code_c"}}
        ],
        orderBy: [{"fieldName": "order_date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI format
      return response.data.map(item => ({
        Id: item.Id,
        orderDate: item.order_date_c,
        status: item.status_c,
        total: item.total_c,
        items: item.items_c ? JSON.parse(item.items_c) : [],
        shippingAddress: {
          firstName: item.shipping_address_first_name_c,
          lastName: item.shipping_address_last_name_c,
          address: item.shipping_address_address_c,
          city: item.shipping_address_city_c,
          state: item.shipping_address_state_c,
          zipCode: item.shipping_address_zip_code_c,
          country: item.shipping_address_country_c
        },
        billingInfo: {
          email: item.billing_info_email_c,
          phone: item.billing_info_phone_c,
          address: item.billing_info_address_c,
          city: item.billing_info_city_c,
          state: item.billing_info_state_c,
          zipCode: item.billing_info_zip_code_c
        }
      }));
    } catch (error) {
      console.error("Error fetching orders:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(250);
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById('order_c', id, {
        fields: [
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "shipping_address_first_name_c"}},
          {"field": {"Name": "shipping_address_last_name_c"}},
          {"field": {"Name": "shipping_address_address_c"}},
          {"field": {"Name": "shipping_address_city_c"}},
          {"field": {"Name": "shipping_address_state_c"}},
          {"field": {"Name": "shipping_address_zip_code_c"}},
          {"field": {"Name": "shipping_address_country_c"}},
          {"field": {"Name": "billing_info_email_c"}},
          {"field": {"Name": "billing_info_phone_c"}},
          {"field": {"Name": "billing_info_address_c"}},
          {"field": {"Name": "billing_info_city_c"}},
          {"field": {"Name": "billing_info_state_c"}},
          {"field": {"Name": "billing_info_zip_code_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Order not found");
      }

      // Transform database fields to UI format
      const item = response.data;
      return {
        Id: item.Id,
        orderDate: item.order_date_c,
        status: item.status_c,
        total: item.total_c,
        items: item.items_c ? JSON.parse(item.items_c) : [],
        shippingAddress: {
          firstName: item.shipping_address_first_name_c,
          lastName: item.shipping_address_last_name_c,
          address: item.shipping_address_address_c,
          city: item.shipping_address_city_c,
          state: item.shipping_address_state_c,
          zipCode: item.shipping_address_zip_code_c,
          country: item.shipping_address_country_c
        },
        billingInfo: {
          email: item.billing_info_email_c,
          phone: item.billing_info_phone_c,
          address: item.billing_info_address_c,
          city: item.billing_info_city_c,
          state: item.billing_info_state_c,
          zipCode: item.billing_info_zip_code_c
        }
      };
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error?.response?.data?.message || error);
      throw new Error("Order not found");
    }
  },

  async create(orderData) {
    try {
      await delay(400);
      const apperClient = getApperClient();
      
      const response = await apperClient.createRecord('order_c', {
        records: [{
          order_date_c: new Date().toISOString(),
          status_c: "Confirmed",
          total_c: orderData.total,
          items_c: JSON.stringify(orderData.items),
          shipping_address_first_name_c: orderData.shippingAddress.firstName,
          shipping_address_last_name_c: orderData.shippingAddress.lastName,
          shipping_address_address_c: orderData.shippingAddress.address,
          shipping_address_city_c: orderData.shippingAddress.city,
          shipping_address_state_c: orderData.shippingAddress.state,
          shipping_address_zip_code_c: orderData.shippingAddress.zipCode,
          shipping_address_country_c: orderData.shippingAddress.country,
          billing_info_email_c: orderData.billingInfo.email,
          billing_info_phone_c: orderData.billingInfo.phone,
          billing_info_address_c: orderData.billingInfo.address,
          billing_info_city_c: orderData.billingInfo.city,
          billing_info_state_c: orderData.billingInfo.state,
          billing_info_zip_code_c: orderData.billingInfo.zipCode
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create order");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} orders:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            orderDate: created.order_date_c,
            status: created.status_c,
            total: created.total_c,
            items: created.items_c ? JSON.parse(created.items_c) : [],
            shippingAddress: {
              firstName: created.shipping_address_first_name_c,
              lastName: created.shipping_address_last_name_c,
              address: created.shipping_address_address_c,
              city: created.shipping_address_city_c,
              state: created.shipping_address_state_c,
              zipCode: created.shipping_address_zip_code_c,
              country: created.shipping_address_country_c
            },
            billingInfo: {
              email: created.billing_info_email_c,
              phone: created.billing_info_phone_c,
              address: created.billing_info_address_c,
              city: created.billing_info_city_c,
              state: created.billing_info_state_c,
              zipCode: created.billing_info_zip_code_c
            }
          };
        }
      }
      
      throw new Error("Failed to create order");
    } catch (error) {
      console.error("Error creating order:", error?.response?.data?.message || error);
      throw new Error("Failed to create order");
    }
  },

  async updateStatus(id, status) {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const response = await apperClient.updateRecord('order_c', {
        records: [{
          Id: id,
          status_c: status
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update order status");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} orders:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            orderDate: updated.order_date_c,
            status: updated.status_c,
            total: updated.total_c,
            items: updated.items_c ? JSON.parse(updated.items_c) : [],
            shippingAddress: {
              firstName: updated.shipping_address_first_name_c,
              lastName: updated.shipping_address_last_name_c,
              address: updated.shipping_address_address_c,
              city: updated.shipping_address_city_c,
              state: updated.shipping_address_state_c,
              zipCode: updated.shipping_address_zip_code_c,
              country: updated.shipping_address_country_c
            },
            billingInfo: {
              email: updated.billing_info_email_c,
              phone: updated.billing_info_phone_c,
              address: updated.billing_info_address_c,
              city: updated.billing_info_city_c,
              state: updated.billing_info_state_c,
              zipCode: updated.billing_info_zip_code_c
            }
          };
        }
      }
      
      throw new Error("Failed to update order status");
    } catch (error) {
      console.error("Error updating order status:", error?.response?.data?.message || error);
      throw new Error("Failed to update order status");
    }
  },

  async delete(id) {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord('order_c', {
        RecordIds: [id]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} orders:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting order:", error?.response?.data?.message || error);
      return false;
    }
  }
};