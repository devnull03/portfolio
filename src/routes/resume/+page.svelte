<script lang="ts">
  import { onMount } from "svelte";
  import { resumeData } from "$lib/data/resume.data";
  import ContactInfo from "$lib/components/resume/ContactInfo.svelte";
  import EducationSection from "$lib/components/resume/EducationSection.svelte";
  import ExperienceSection from "$lib/components/resume/ExperienceSection.svelte";
  import ProjectsSection from "$lib/components/resume/ProjectsSection.svelte";
  import SkillsSection from "$lib/components/resume/SkillsSection.svelte";
  import LanguagesSection from "$lib/components/resume/LanguagesSection.svelte";
  import VolunteerSection from "$lib/components/resume/VolunteerSection.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Download } from "@lucide/svelte";

  let mounted = $state(false);
  let activeSection = $state("contact");

  const sections = [
    { id: "contact", title: "Contact", icon: "👤" },
    { id: "education", title: "Education", icon: "🎓" },
    { id: "experience", title: "Experience", icon: "💼" },
    { id: "projects", title: "Projects", icon: "🚀" },
    { id: "skills", title: "Skills", icon: "⚡" },
    { id: "languages", title: "Languages", icon: "🌍" },
    { id: "volunteer", title: "Volunteer", icon: "❤️" },
  ];

  function scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function updateActiveSection() {
    if (!mounted) return;

    const sectionElements = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);
    const scrollPosition = window.scrollY + 200;

    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const element = sectionElements[i];
      if (element && element.offsetTop <= scrollPosition) {
        activeSection = sections[i].id;
        break;
      }
    }
  }

  onMount(() => {
    mounted = true;
    window.addEventListener("scroll", updateActiveSection);
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  });
</script>

<svelte:head>
  <title>Resume - {resumeData.contact.name}</title>
  <meta
    name="description"
    content="Professional resume of {resumeData.contact
      .name} - {resumeData.summary}"
  />
  <meta
    name="keywords"
    content="resume, software developer, computer science, full-stack, web development"
  />
</svelte:head>

<!-- Floating Navigation -->
{#if mounted}
  <nav
    class="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block font-serif"
  >
    <div class="relative">
      <!-- Navigation Line -->
      <div
        class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"
      ></div>

      <!-- Navigation Points -->
      <div class="relative space-y-6">
        {#each sections as section, i}
          <button
            class="relative group flex items-center"
            onclick={() => scrollToSection(section.id)}
          >
            <!-- Dot -->
            <div
              class="w-3 h-3 rounded-full border-2 bg-background transition-all duration-200 {activeSection ===
              section.id
                ? 'border-foreground bg-foreground scale-125'
                : 'border-muted-foreground hover:border-foreground hover:scale-110'}"
            ></div>

            <!-- Tooltip -->
            <div
              class="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100
                        transition-opacity duration-200 pointer-events-none"
            >
              <div
                class="bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-md
                          text-sm font-medium whitespace-nowrap border"
              >
                <span class="mr-2">{section.icon}</span>
                {section.title}
              </div>
            </div>
          </button>
        {/each}
      </div>
    </div>
  </nav>
{/if}

<!-- Mobile Navigation -->
<nav class="lg:hidden fixed top-4 left-4 right-4 z-50 font-serif">
  <div
    class="bg-background/95 backdrop-blur-sm border rounded-full px-4 py-2 shadow-lg"
  >
    <div class="flex items-center justify-between space-x-2 overflow-x-auto">
      {#each sections as section}
        <button
          class="flex-shrink-0 p-2 rounded-full transition-colors duration-200 {activeSection ===
          section.id
            ? 'bg-accent text-accent-foreground'
            : 'hover:bg-accent/50'}"
          onclick={() => scrollToSection(section.id)}
          title={section.title}
        >
          <span class="text-sm">{section.icon}</span>
        </button>
      {/each}
    </div>
  </div>
</nav>

<!-- Main Content -->
<div class="min-h-screen bg-background !font-sans" id="smooth-content">
  <div class="max-w-4xl mx-auto px-6 lg:px-12 py-8 lg:py-16">
    <!-- Contact Information Header -->
    <section id="contact" class="mb-16">
      <div
        class="bg-gradient-to-r from-muted/50 to-background rounded-2xl p-8 border"
      >
        <ContactInfo
          contact={resumeData.contact}
          summary={resumeData.summary}
        />
      </div>
    </section>

    <!-- Resume Sections -->
    <div class="space-y-16">
      <!-- Education Section -->
      <section id="education" class="scroll-mt-24">
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-2xl">🎓</span>
            <h2 class="text-3xl font-bold text-foreground">Education</h2>
          </div>
          <div
            class="w-20 h-1 bg-gradient-to-r from-accent to-transparent rounded-full"
          ></div>
        </div>
        <EducationSection education={resumeData.education} />
      </section>

      <!-- Experience Section -->
      <section id="experience" class="scroll-mt-24">
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-2xl">💼</span>
            <h2 class="text-3xl font-bold text-foreground">Experience</h2>
          </div>
          <div
            class="w-20 h-1 bg-gradient-to-r from-accent to-transparent rounded-full"
          ></div>
        </div>
        <ExperienceSection experience={resumeData.experience} />
      </section>

      <!-- Projects Section -->
      <section id="projects" class="scroll-mt-24">
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-2xl">🚀</span>
            <h2 class="text-3xl font-bold text-foreground">Projects</h2>
          </div>
          <div
            class="w-20 h-1 bg-gradient-to-r from-accent to-transparent rounded-full"
          ></div>
        </div>
        <ProjectsSection projects={resumeData.projects} />
      </section>

      <!-- Skills Section -->
      <section id="skills" class="scroll-mt-24">
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-2xl">⚡</span>
            <h2 class="text-3xl font-bold text-foreground">Skills</h2>
          </div>
          <div
            class="w-20 h-1 bg-gradient-to-r from-accent to-transparent rounded-full"
          ></div>
        </div>
        <SkillsSection skills={resumeData.skills} />
      </section>

      <!-- Languages Section -->
      <section id="languages" class="scroll-mt-24">
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-2xl">🌍</span>
            <h2 class="text-3xl font-bold text-foreground">Languages</h2>
          </div>
          <div
            class="w-20 h-1 bg-gradient-to-r from-accent to-transparent rounded-full"
          ></div>
        </div>
        <LanguagesSection languages={resumeData.languages} />
      </section>

      <!-- Volunteer Section -->
      <section id="volunteer" class="scroll-mt-24">
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-2xl">❤️</span>
            <h2 class="text-3xl font-bold text-foreground">
              Volunteer Experience
            </h2>
          </div>
          <div
            class="w-20 h-1 bg-gradient-to-r from-accent to-transparent rounded-full"
          ></div>
        </div>
        <VolunteerSection volunteer={resumeData.volunteer} />
      </section>
    </div>

    <!-- Download Resume Button -->
    <div class="mt-16 text-center">
      <Button
        href={resumeData.contact.resumePdf}
        target="_blank"
        rel="noopener noreferrer"
        size="lg"
        class="gap-2 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
      >
        <Download class="h-5 w-5" />
        Download PDF Resume
      </Button>
    </div>
  </div>
</div>
