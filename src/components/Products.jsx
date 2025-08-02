import { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
  Container, 
  Grid,
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  TextField, 
  Box,
  Chip,
  Pagination,
  Stack
} from '@mui/material';
import { ShoppingCart, Visibility } from '@mui/icons-material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useNavigate } from 'react-router';
import api from '../utils/axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [view, setView] = useState('grid');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
    setCurrentPage(1);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/posts');
      const mockProducts = response.data.slice(0, 24).map(post => ({
        id: post.id,
        title: post.title,
        price: Math.floor(Math.random() * 500) + 20,
        category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
        image: `https://picsum.photos/300/200?random=${post.id}`,
        description: post.body
      }));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
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
  };

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Loading products...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Products ({filteredProducts.length} items)
          </Typography>
          
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view toggle"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        <TextField
          fullWidth
          label="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
        />

        {view === 'grid' ? (
          <Grid container spacing={3}>
            {currentProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {product.title.length > 50 
                        ? `${product.title.substring(0, 50)}...` 
                        : product.title
                      }
                    </Typography>
                    
                    <Chip 
                      label={product.category} 
                      size="small" 
                      sx={{ mb: 1 }} 
                    />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description
                      }
                    </Typography>
                    
                    <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                      ${product.price}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Visibility />}
                        onClick={() => handleViewProduct(product.id)}
                        sx={{ mb: 1 }}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<ShoppingCart />}
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <List>
            {currentProducts.map((product) => (
              <ListItem
                key={product.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: 'background.paper'
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" color="primary">
                      ${product.price}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => handleViewProduct(product.id)}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    src={product.image}
                    alt={product.title}
                    sx={{ width: 80, height: 80, borderRadius: 1 }}
                    variant="rounded"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" component="span">
                        {product.title}
                      </Typography>
                      <Chip 
                        label={product.category} 
                        size="small" 
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {product.description.length > 150 
                        ? `${product.description.substring(0, 150)}...` 
                        : product.description
                      }
                    </Typography>
                  }
                  sx={{ mr: 20 }}
                />
              </ListItem>
            ))}
          </List>
        )}

        {totalPages > 1 && (
          <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
            <Typography variant="body2" color="text.secondary">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
            </Typography>
          </Stack>
        )}

        {filteredProducts.length === 0 && (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No products found
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Products;