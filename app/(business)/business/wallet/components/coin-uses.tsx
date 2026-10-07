import { COIN_USES } from "../constant/wallet.constant";

export function CoinUses() {
  return (
    <ul className="divide-y rounded-xl border bg-surface">
      {COIN_USES.map(({ id, icon: Icon, title, description, price }) => (
        <li key={id} className="flex items-center gap-4 p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-maroon-soft text-primary">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <span className="shrink-0 text-sm font-medium">{price}</span>
        </li>
      ))}
    </ul>
  );
}
