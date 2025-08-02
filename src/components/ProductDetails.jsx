import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import api from '../utils/axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      // Since we're using mock data, we'll fetch all products and find the one we need
      const response = await api.get('/posts');
      const mockProducts = response.data.slice(0, 24).map(post => ({
        id: post.id,
        title: post.title,
        price: Math.floor(Math.random() * 500) + 20,
        category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
        image: `https://picsum.photos/600/400?random=${post.id}`,
        description: post.body
      }));
      
      const foundProduct = mockProducts.find(p => p.id === parseInt(id));
      setProduct(foundProduct);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show a simple alert or you could add a toast notification
    alert('Product added to cart!');
  };

  const handleBackClick = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Loading product details...
        </Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Product not found
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button onClick={handleBackClick} startIcon={<ArrowBack />}>
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button onClick={handleBackClick} startIcon={<ArrowBack />}>
          Back to Products
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              image={product.image}
              alt={product.title}
              sx={{ height: 400, objectFit: 'cover' }}
            />
          </Card>
        </Grid>
        
        <Grid xs={12} md={6}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
              {product.title}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={product.category} 
                color="primary"
                size="medium"
              />
            </Box>
            
            <Typography variant="h3" color="primary" sx={{ mb: 3, fontWeight: 'bold' }}>
              ${product.price}
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
              {product.description}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={() => addToCart(product)}
                sx={{ minWidth: 200 }}
              >
                Add to Cart
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/cart')}
              >
                View Cart
              </Button>
            </Box>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Product ID:</strong> {product.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Category:</strong> {product.category}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;
