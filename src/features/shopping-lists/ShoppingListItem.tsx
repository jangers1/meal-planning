
interface ShoppingListItemProps {
    id: number;
    name: string;
}

function ShoppingListItem({ id, name }: ShoppingListItemProps) {
    return (
        <>
            <li
                key={id}
            >
                {name}
            </li>
        </>
    )
}

export default ShoppingListItem;