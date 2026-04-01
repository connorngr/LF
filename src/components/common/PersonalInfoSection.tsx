"use client";

import Image from "next/image";
import { Check, Users, ImageIcon } from "lucide-react";
import { PersonalInfo } from "@/schemas";
import Button from "./Button";

interface PersonalInfoSectionProps {
  info: PersonalInfo;
  onFollowClick?: () => void;
}

export default function PersonalInfoSection({
  info,
  onFollowClick,
}: Readonly<PersonalInfoSectionProps>) {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-surface shadow-md shadow-primary">
      <div className="flex flex-col lg:flex-row">
        <div className="relative lg:w-1/2 order-2 lg:order-1 flex flex-col justify-end p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 bg-background">

          <div className="w-full bg-surface/50 lg:bg-surface lg:border lg:border-surface-lighter p-6 sm:p-8 md:p-10 rounded-2xl backdrop-blur-md shadow-lg shadow-primary">
            <div className="flex items-center sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                {info.name}
              </h1>
              {info.isVerified && (
                <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-foreground stroke-3" />
                </div>
              )}
            </div>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-foreground mb-6 sm:mb-8 md:mb-10 leading-relaxed font-light">
              {info.bio}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-background/90 lg:bg-background border border-surface-lighter backdrop-blur-md shadow-md">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                    {info.stats.followers}
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-background/90 lg:bg-background border border-surface-lighter backdrop-blur-md shadow-md">
                  <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                    {info.stats.posts}
                  </span>
                </div>
              </div>

              <Button
                onClick={onFollowClick}
                variant="primary"
                size="lg"
                fullWidth
                className="whitespace-nowrap sm:w-auto lg:text-2xl"
              >
                Follow <span className="text-xl sm:text-2xl md:text-3xl font-light">+</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative lg:w-1/2 order-1 lg:order-2 min-h-[50vh] lg:min-h-full">
          <Image
            src={info.avatar}
            alt={info.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
            priority
          />
        </div>
      </div>
    </section>
  );
}
