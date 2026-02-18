"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  price: number;
  image: string;
  category: string;
  index?: number;
}

const EventCard = ({
  slug,
  title,
  subtitle,
  date,
  location,
  price,
  image,
  category,
  index = 0,
}: EventCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/event/${slug}`}>
        <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

            {/* Category Badge */}
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ticket-gradient text-primary-foreground">
              {category}
            </span>

            {/* Price Tag */}
            {price > 0 && (
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                R$ {price.toFixed(2)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-display text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-1">{subtitle}</p>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {date}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="line-clamp-1">{location}</span>
              </span>
            </div>

            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
              Ver Detalhes
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
