# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PlotListingViewSet, JointOwnerViewSet, BookingViewSet,
    EcommerceProductViewSet, OrderViewSet, OrderItemViewSet,
    RealEstateAgentProfileViewSet, RealEstateAgentRegistrationView,
    UserRegistrationView, OTPRequestView, OTPVerificationAndLoginView,
    UserLoginView, UserLogoutView, ReferralNetworkView,
    SQLFTProjectViewSet, AgentPlotViewSet, MicroPlotViewSet
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'plots', PlotListingViewSet, basename='plot')
router.register(r'joint-owners', JointOwnerViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'products', EcommerceProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)
router.register(r'agents', RealEstateAgentProfileViewSet)
router.register(r'sqlft-projects', SQLFTProjectViewSet)
router.register(r'agent-plots', AgentPlotViewSet, basename='agent-plot')
router.register(r'micro-plots', MicroPlotViewSet, basename='microplot')



urlpatterns = [
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/request-otp/', OTPRequestView.as_view(), name='request-otp'),
    path('auth/verify-otp/', OTPVerificationAndLoginView.as_view(), name='verify-otp'),
    path('auth/login/', UserLoginView.as_view(), name='login'),
    path('auth/logout/', UserLogoutView.as_view(), name='logout'),
    path('agents/register/', RealEstateAgentRegistrationView.as_view(), name='agent-register'),
    path('', include(router.urls)),
    path('auth/jwt/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('referral/network/', ReferralNetworkView.as_view(), name='referral-network')
]
