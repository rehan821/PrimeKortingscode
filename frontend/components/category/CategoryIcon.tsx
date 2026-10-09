import type { IconName } from "@/types";
import {
  AutoIcon,
  BeautyIcon,
  BooksIcon,
  ElectronicsIcon,
  EnergyIcon,
  FashionIcon,
  FinanceIcon,
  FoodIcon,
  GardenIcon,
  HomeIcon,
  KidsIcon,
  MarketplaceIcon,
  PetsIcon,
  SoftwareIcon,
  SportIcon,
  TagIcon,
  ToysIcon,
  TravelIcon,
} from "@/components/ui/icons";

const MAP: Record<IconName, typeof TravelIcon> = {
  fashion: FashionIcon,
  electronics: ElectronicsIcon,
  travel: TravelIcon,
  home: HomeIcon,
  beauty: BeautyIcon,
  sport: SportIcon,
  food: FoodIcon,
  kids: KidsIcon,
  books: BooksIcon,
  pets: PetsIcon,
  auto: AutoIcon,
  finance: FinanceIcon,
  software: SoftwareIcon,
  marketplace: MarketplaceIcon,
  energy: EnergyIcon,
  garden: GardenIcon,
  toys: ToysIcon,
};

interface CategoryIconProps {
  name?: IconName;
  size?: number;
  className?: string;
}

export function CategoryIcon({ name, size = 22, className }: CategoryIconProps) {
  const Component = (name && MAP[name]) || TagIcon;
  return <Component size={size} className={className} />;
}
