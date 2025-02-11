
interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  status: string;
  inStock: number;
  price: number;
}

interface ProductGridViewProps {
  products: Product[];
  getStatusColor: (status: string) => string;
}

export const ProductGridView = ({ products, getStatusColor }: ProductGridViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div 
          key={product.id}
          className="group relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-lg"
        >
          <div className="aspect-square overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 bg-background/90 px-2 py-1 rounded-md">
              <span className="font-semibold">${product.price}</span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
              <span className="text-sm font-medium">Stock: {product.inStock}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
