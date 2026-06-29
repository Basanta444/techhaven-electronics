// 1. Add these imports at the very top
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this path is correct

// ... inside your ProductDetail function ...

  // 2. Replace the old useEffect with this one:
  useEffect(() => {
    const fetchProductFromFirebase = async () => {
      if (!id) return; // Make sure we have an ID from the URL

      try {
        // Point to the specific document in the "products" collection
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // If found, set it in the state
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          console.log("No such product found in Firebase!");
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product from Firebase: ", error);
      }
    };

    fetchProductFromFirebase();
  }, [id]);



// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Product } from '../types';
// import { useStore } from '../store';
// import { Button } from '../components/ui/button';
// import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

// export function ProductDetail() {
//   const { id } = useParams<{ id: string }>();
//   const [product, setProduct] = useState<Product | null>(null);
//   const { addToCart, toggleWishlist, wishlist } = useStore();

//   useEffect(() => {
//     fetch('/api/products')
//       .then(res => res.json())
//       .then(data => {
//         const p = data.find((item: Product) => item.id === id);
//         setProduct(p || null);
//       });
//   }, [id]);

//   if (!product) {
//     return <div className="container mx-auto max-w-7xl px-4 py-20 text-center">Loading...</div>;
//   }

//   const isWishlisted = wishlist.some(item => item.id === product.id);

//   return (
//     <div className="container mx-auto max-w-7xl px-4 py-12">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//         {/* Image Gallery */}
//         <div className="bg-neutral-50 rounded-xl p-8 flex items-center justify-center">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="max-w-full h-auto object-contain mix-blend-multiply"
//           />
//         </div>

//         {/* Product Info */}
//         <div className="flex flex-col">
//           <div className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">
//             {product.brand} • {product.category}
//           </div>
//           <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
//           <div className="text-3xl font-bold mb-6">${product.price.toLocaleString()}</div>
          
//           <p className="text-neutral-600 mb-8 leading-relaxed">
//             {product.specs}. This premium device offers unparalleled performance and design, crafted to meet the highest standards of technology.
//           </p>

//           <div className="flex gap-4 mb-8">
//             <Button size="lg" className="flex-1 flex gap-2" onClick={() => addToCart(product)}>
//               <ShoppingCart className="h-5 w-5" /> Add to Cart
//             </Button>
//             <Button size="lg" variant="outline" onClick={() => toggleWishlist(product)} className={isWishlisted ? 'text-red-500 border-red-500' : ''}>
//               <Heart className="h-5 w-5" fill={isWishlisted ? 'currentColor' : 'none'} />
//             </Button>
//           </div>

//           <div className="space-y-4 pt-6 border-t border-neutral-200">
//             <div className="flex items-center gap-3 text-sm">
//               <Truck className="h-5 w-5 text-neutral-500" />
//               <span>Free Delivery within 2-3 business days</span>
//             </div>
//             <div className="flex items-center gap-3 text-sm">
//               <ShieldCheck className="h-5 w-5 text-neutral-500" />
//               <span>1 Year Official Warranty</span>
//             </div>
//             <div className="flex items-center gap-3 text-sm">
//               <RotateCcw className="h-5 w-5 text-neutral-500" />
//               <span>30-Day Return Policy</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
