import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "imageUrl_c"}},
          {"field": {"Name": "in_stock_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
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
        name: item.name_c,
        price: item.price_c,
        description: item.description_c,
        category: item.category_c,
        imageUrl: item.imageUrl_c,
        inStock: item.in_stock_c
      }));
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById('product_c', id, {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "imageUrl_c"}},
          {"field": {"Name": "in_stock_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Product not found");
      }

      // Transform database fields to UI format
      return {
        Id: response.data.Id,
        name: response.data.name_c,
        price: response.data.price_c,
        description: response.data.description_c,
        category: response.data.category_c,
        imageUrl: response.data.imageUrl_c,
        inStock: response.data.in_stock_c
      };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error?.response?.data?.message || error);
      throw new Error("Product not found");
    }
  },

  async getByCategory(category) {
    try {
      await delay(250);
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "imageUrl_c"}},
          {"field": {"Name": "in_stock_c"}}
        ],
        where: [{"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]}],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI format
      return response.data.map(item => ({
        Id: item.Id,
        name: item.name_c,
        price: item.price_c,
        description: item.description_c,
        category: item.category_c,
        imageUrl: item.imageUrl_c,
        inStock: item.in_stock_c
      }));
    } catch (error) {
      console.error("Error fetching products by category:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(productData) {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const response = await apperClient.createRecord('product_c', {
        records: [{
          name_c: productData.name,
          price_c: productData.price,
          description_c: productData.description,
          category_c: productData.category,
          imageUrl_c: productData.imageUrl,
          in_stock_c: productData.inStock
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create product");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} products:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            name: created.name_c,
            price: created.price_c,
            description: created.description_c,
            category: created.category_c,
            imageUrl: created.imageUrl_c,
            inStock: created.in_stock_c
          };
        }
      }
      
      throw new Error("Failed to create product");
    } catch (error) {
      console.error("Error creating product:", error?.response?.data?.message || error);
      throw new Error("Failed to create product");
    }
  },

  async update(id, productData) {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const response = await apperClient.updateRecord('product_c', {
        records: [{
          Id: id,
          name_c: productData.name,
          price_c: productData.price,
          description_c: productData.description,
          category_c: productData.category,
          imageUrl_c: productData.imageUrl,
          in_stock_c: productData.inStock
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update product");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} products:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            name: updated.name_c,
            price: updated.price_c,
            description: updated.description_c,
            category: updated.category_c,
            imageUrl: updated.imageUrl_c,
            inStock: updated.in_stock_c
          };
        }
      }
      
      throw new Error("Failed to update product");
    } catch (error) {
      console.error("Error updating product:", error?.response?.data?.message || error);
      throw new Error("Failed to update product");
    }
  },

  async delete(id) {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord('product_c', {
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
          console.error(`Failed to delete ${failed.length} products:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting product:", error?.response?.data?.message || error);
      return false;
    }
  }
};