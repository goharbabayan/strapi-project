export default function ShopLayout({ children, params }) {
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  console.log(params, "params");
  return <section>Params: {params.tag} </section>
}
