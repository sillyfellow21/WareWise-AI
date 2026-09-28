import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../navbar';
import ProductDetailWidget from '../widgets/ProductDetailWidget';
import { apiUrl } from '../../services/api';
import { setProduct } from '../../state'; // Ensure correct import path

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const token = useSelector((state) => state.token);
  const products = useSelector((state) => state.products.products);

  // Find the ride in the state using rideId
  const currentProduct = products.find((product) => product._id === productId);

  const getProduct = useCallback(async () => {
    const response = await fetch(
      apiUrl(`/products/${productId}/product`),
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await response.json();
    dispatch(setProduct({ product: data }));
  }, [dispatch, productId, token]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  return (
    <Box>
      <Navbar />
      <Box>
        {currentProduct && (
          <ProductDetailWidget
            productId={currentProduct._id}
            productUserId={currentProduct.userId}
            name={currentProduct.name}
            description={currentProduct.description}
            price={currentProduct.price}
            quantity={currentProduct.quantity}
            minQuantity={currentProduct.minQuantity}
            reorderPoint={currentProduct.reorderPoint}
            maxQuantity={currentProduct.maxQuantity}
            status={currentProduct.status}
            category={currentProduct.category}
            bookings={currentProduct.bookings}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProductDetail;
