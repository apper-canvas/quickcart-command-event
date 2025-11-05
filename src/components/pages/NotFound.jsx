import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-4">
          <ApperIcon 
            name="ShoppingCart" 
            size={80} 
            className="mx-auto text-primary opacity-20" 
          />
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-secondary">
            Page Not Found
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Sorry, the page you're looking for doesn't exist. 
            Let's get you back to shopping!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => navigate("/")}
            className="px-6 py-3"
          >
            <ApperIcon name="Home" size={16} className="mr-2" />
            Back to Home
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            className="px-6 py-3"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;