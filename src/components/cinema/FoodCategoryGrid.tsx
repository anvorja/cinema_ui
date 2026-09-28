// Categorías del menú: imagen y datos en un panel plano.
const FoodCategoryGrid = ({ categories = [] }: { categories?: any[] }) => (
  <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
    {categories.map((category) => (
      <li key={category.id}>
        <FoodCategoryCard category={category} />
      </li>
    ))}
  </ul>
);

const FoodCategoryCard = ({ category }: { category: any }) => (
  <article className="h-full border border-board-line bg-board-panel">
    <img src={category.image} alt="" loading="lazy" className="aspect-square w-full object-cover" />
    <div className="border-t border-board-line p-3 sm:p-4">
      <h3 className="font-board text-2xl font-bold leading-none tracking-wide uppercase">{category.name}</h3>
      <p className="mt-1 text-sm text-board-mute">{category.description}</p>
      {category.itemCount && <p className="mt-2 font-data text-xs font-bold text-board-amberink">{category.itemCount} productos</p>}
    </div>
  </article>
);

export { FoodCategoryGrid, FoodCategoryCard };
