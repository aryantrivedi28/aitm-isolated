import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { OpenAIProfileRater } from "./open-ai-profile-rater"

export class FreelancerProfileService {
  private supabase: any

  async initialize() {
    const cookieStore = await cookies()
    this.supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: any) {
            try {
              cookiesToSet.forEach(({ name, value, options }: any) => cookieStore.set(name, value, options))
            } catch {
              // Handle cookie setting errors
            }
          },
        },
      },
    )
  }

  async getProfile(freelancerId: string) {
    const { data, error } = await this.supabase.from("freelancers").select("*").eq("id", freelancerId).single()

    if (error) throw error
    return data
  }

  async updateProfile(freelancerId: string, updates: any) {
    const { data, error } = await this.supabase
      .from("freelancers")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", freelancerId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async calculateAndSaveRating(freelancerId: string, profileData: any) {
    const rater = new OpenAIProfileRater()
    const ratingResult = await rater.calculateAverageRating(profileData)

    // Save rating to database
    const { data, error } = await this.supabase
      .from("freelancers")
      .update({
        profile_rating: ratingResult.rating,
        rating_feedback: ratingResult.feedback,
        updated_at: new Date().toISOString(),
      })
      .eq("id", freelancerId)
      .select()
      .single()

    if (error) throw error
    return { profile: data, rating: ratingResult }
  }

  async createProfile(freelancerId: string, email: string, initialData: any = {}) {
    const { data, error } = await this.supabase
      .from("freelancers")
      .insert({
        id: freelancerId,
        email,
        ...initialData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}
