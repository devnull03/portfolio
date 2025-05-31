<script lang="ts">
  import type { ProjectsSectionProps } from "$lib/interfaces/resume.interface";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Separator } from "$lib/components/ui/separator";
  import FolderIcon from "@lucide/svelte/icons/folder";
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
  import GithubIcon from "@lucide/svelte/icons/github";
  import CodeIcon from "@lucide/svelte/icons/code";
  import StarIcon from "@lucide/svelte/icons/star";
  import { getProjectsByIds } from "$lib/data/projects.data";

  let { projects: projectIds }: ProjectsSectionProps = $props();
  let projects = $derived(getProjectsByIds(projectIds));
</script>

<div class="space-y-6">
  {#each projects as project}
    <Card class="hover:shadow-lg transition-shadow duration-200">
      <CardHeader class="pb-4">
        <div
          class="flex flex-col md:flex-row md:justify-between md:items-start gap-3"
        >
          <div class="space-y-2">
            <CardTitle class="flex items-center gap-2 text-lg">
              <FolderIcon class="h-5 w-5 text-muted-foreground" />
              {project.name}
            </CardTitle>
            {#if project.role}
              <p class="text-sm text-muted-foreground font-medium">
                {project.role}
              </p>
            {/if}
          </div>
          <div class="flex flex-col gap-3 text-sm md:items-end">
            {#if project.startDate}
              <div class="flex items-center gap-1 text-muted-foreground">
                <CalendarIcon class="h-4 w-4" />
                {project.startDate}{#if project.endDate}
                  - {project.endDate}{/if}
              </div>
            {/if}
            <div class="flex gap-2">
              {#if project.githubUrl}
                <Button variant="outline" size="sm">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-1"
                  >
                    <GithubIcon class="h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              {/if}
              {#if project.liveUrl}
                <Button variant="outline" size="sm">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-1"
                  >
                    <ExternalLinkIcon class="h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              {/if}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent class="space-y-4">
        <p class="text-muted-foreground leading-relaxed">
          {project.description}
        </p>

        {#if project.technologies && project.technologies.length > 0}
          <div>
            <h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
              <CodeIcon class="h-4 w-4 text-muted-foreground" />
              Technologies
            </h4>
            <div class="flex flex-wrap gap-2">
              {#each project.technologies as tech}
                <Badge variant="outline" class="text-xs">
                  {tech}
                </Badge>
              {/each}
            </div>
          </div>
          {#if project.features && project.features.length > 0}
            <Separator />
          {/if}
        {/if}

        {#if project.features && project.features.length > 0}
          <div>
            <div class="flex items-center gap-2 mb-3">
              <StarIcon class="h-4 w-4 text-muted-foreground" />
              <h4 class="text-sm font-semibold">Key Features</h4>
            </div>
            <ul
              class="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-6"
            >
              {#each project.features as feature}
                <li class="leading-relaxed">{feature}</li>
              {/each}
            </ul>
          </div>
        {/if}
      </CardContent>
    </Card>
  {/each}
</div>
